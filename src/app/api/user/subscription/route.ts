import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await db.subscription.findUnique({
      where: { userId },
      select: {
        plan: true,
        status: true,
        stripeCustomerId: true,
        auditsUsed: true,
        auditsLimit: true,
      },
    });

    const stripeConfigured = !!(
      process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_STARTER_PRICE_ID &&
      process.env.STRIPE_PRO_PRICE_ID
    );

    return NextResponse.json({
      subscription: subscription || {
        plan: "free",
        status: "active",
        stripeCustomerId: null,
        auditsUsed: 0,
        auditsLimit: 2,
      },
      stripeConfigured,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
