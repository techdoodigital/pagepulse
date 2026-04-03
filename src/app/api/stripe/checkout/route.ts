import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured yet. Please add your Stripe API keys." },
        { status: 503 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await req.json();

    // Accept either priceId directly or plan name
    let priceId: string | null = body.priceId || null;
    let plan: string = body.plan || "unknown";

    if (!priceId && plan) {
      // Resolve priceId from plan name
      priceId =
        plan === "starter"
          ? process.env.STRIPE_STARTER_PRICE_ID || null
          : plan === "pro"
          ? process.env.STRIPE_PRO_PRICE_ID || null
          : null;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan or Stripe price IDs not configured" },
        { status: 400 }
      );
    }

    // Resolve plan name from priceId if we only got a priceId
    if (plan === "unknown") {
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
        plan = "pro";
      } else if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
        plan = "starter";
      }
    }

    // Validate that the priceId matches one of our configured plans
    const validPriceIds = [
      process.env.STRIPE_STARTER_PRICE_ID,
      process.env.STRIPE_PRO_PRICE_ID,
    ].filter(Boolean);

    if (validPriceIds.length > 0 && !validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: "Invalid price ID" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or retrieve Stripe customer
    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: { userId: user.id, plan },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
