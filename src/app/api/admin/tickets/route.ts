import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  const where = status && status !== "all" ? { status } : {};

  const tickets = await db.supportTicket.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    tickets: tickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      response: t.response,
      userName: t.user.name || t.user.email,
      userEmail: t.user.email,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { ticketId, status, response } = body;

  if (!ticketId) {
    return NextResponse.json(
      { error: "ticketId is required" },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (response !== undefined) data.response = response;

  const ticket = await db.supportTicket.update({
    where: { id: ticketId },
    data,
  });

  return NextResponse.json({ ticket });
}
