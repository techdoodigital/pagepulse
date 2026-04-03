import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function canRunAudit(userId: string): Promise<boolean> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return false;
  }

  // Check if the subscription period has expired for paid plans
  if (
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd < new Date() &&
    subscription.plan !== "free"
  ) {
    return false;
  }

  // Check if user has remaining audits
  return subscription.auditsUsed < subscription.auditsLimit;
}
