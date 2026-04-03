import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const coupons = await db.couponCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { code, discount, maxUses, expiresAt } = body;

  if (!code || discount == null) {
    return NextResponse.json(
      { error: "code and discount are required" },
      { status: 400 }
    );
  }

  const coupon = await db.couponCode.create({
    data: {
      code: code.toUpperCase(),
      discount: parseInt(discount),
      maxUses: maxUses ? parseInt(maxUses) : 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json({ coupon });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (updates.active !== undefined) data.active = updates.active;
  if (updates.code !== undefined) data.code = updates.code.toUpperCase();
  if (updates.discount !== undefined) data.discount = parseInt(updates.discount);
  if (updates.maxUses !== undefined) data.maxUses = parseInt(updates.maxUses);
  if (updates.expiresAt !== undefined)
    data.expiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;

  const coupon = await db.couponCode.update({
    where: { id },
    data,
  });

  return NextResponse.json({ coupon });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await db.couponCode.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
