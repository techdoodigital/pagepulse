import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalUsers, totalAudits, auditsThisMonth, activeProSubs, recentAudits, recentTickets] =
    await Promise.all([
      db.user.count(),
      db.audit.count(),
      db.audit.count({
        where: { createdAt: { gte: firstOfMonth } },
      }),
      db.subscription.count({
        where: { plan: "pro", status: "active" },
      }),
      db.audit.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      db.supportTicket.findMany({
        take: 5,
        where: { status: "open" },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

  return NextResponse.json({
    totalUsers,
    totalAudits,
    auditsThisMonth,
    activeProSubs,
    recentAudits: recentAudits.map((a) => ({
      id: a.id,
      url: a.url,
      title: a.title,
      status: a.status,
      cqs: a.cqs,
      userName: a.user.name || a.user.email,
      createdAt: a.createdAt,
    })),
    recentTickets: recentTickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      priority: t.priority,
      category: t.category,
      userName: t.user.name || t.user.email,
      createdAt: t.createdAt,
    })),
  });
}
