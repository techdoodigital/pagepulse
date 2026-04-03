import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";

// Map price IDs to plan details
function getPlanFromPriceId(priceId: string): { name: string; auditsLimit: number } | null {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
    return { name: "starter", auditsLimit: 15 };
  }
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return { name: "pro", auditsLimit: 50 };
  }
  return null;
}

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planName = session.metadata?.plan;

        if (!userId || !planName) break;

        const subscriptionId = session.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id;

        // Determine audits limit from plan name or price ID
        let auditsLimit = 15;
        if (planName === "pro") {
          auditsLimit = 50;
        } else if (planName === "starter") {
          auditsLimit = 15;
        } else if (priceId) {
          const planInfo = getPlanFromPriceId(priceId);
          if (planInfo) auditsLimit = planInfo.auditsLimit;
        }

        const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;

        await db.subscription.upsert({
          where: { userId },
          update: {
            plan: planName,
            stripeCustomerId: session.customer as string,
            stripeSubId: subscriptionId,
            stripePriceId: priceId,
            status: "active",
            auditsLimit,
            auditsUsed: 0,
            currentPeriodEnd: new Date(periodEnd * 1000),
          },
          create: {
            userId,
            plan: planName,
            stripeCustomerId: session.customer as string,
            stripeSubId: subscriptionId,
            stripePriceId: priceId,
            status: "active",
            auditsLimit,
            auditsUsed: 0,
            currentPeriodEnd: new Date(periodEnd * 1000),
          },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        // Reset auditsUsed on successful payment (new billing cycle)
        const existingSub = await db.subscription.findFirst({
          where: { stripeSubId: subscriptionId },
        });

        if (existingSub) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;

          await db.subscription.update({
            where: { id: existingSub.id },
            data: {
              status: "active",
              auditsUsed: 0,
              currentPeriodEnd: new Date(periodEnd * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const existingSub = await db.subscription.findFirst({
          where: { stripeSubId: sub.id },
        });

        if (existingSub) {
          const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
          const status = sub.status === "active" ? "active" : sub.status === "past_due" ? "past_due" : sub.status;

          // Check if the plan changed
          const priceId = sub.items.data[0]?.price.id;
          const planInfo = priceId ? getPlanFromPriceId(priceId) : null;

          const updateData: Record<string, unknown> = {
            status,
            currentPeriodEnd: new Date(periodEnd * 1000),
          };

          if (planInfo) {
            updateData.plan = planInfo.name;
            updateData.auditsLimit = planInfo.auditsLimit;
            updateData.stripePriceId = priceId;
          }

          await db.subscription.update({
            where: { id: existingSub.id },
            data: updateData,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const existingSub = await db.subscription.findFirst({
          where: { stripeSubId: sub.id },
        });

        if (existingSub) {
          await db.subscription.update({
            where: { id: existingSub.id },
            data: {
              plan: "free",
              status: "canceled",
              auditsLimit: 2,
              auditsUsed: 0,
            },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
