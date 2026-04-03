import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const audit = await db.audit.findUnique({
    where: { id },
  });

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  if (audit.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Fetch user subscription to determine plan
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  const plan = subscription?.plan || "free";

  // Parse scores JSON if present
  const response = {
    id: audit.id,
    url: audit.url,
    sourceType: audit.sourceType || "url",
    title: audit.title,
    status: audit.status,
    sourceContent: audit.sourceContent,
    scores: audit.scores ? JSON.parse(audit.scores) : null,
    report: audit.report,
    revisedContent: audit.revisedContent,
    cqs: audit.cqs,
    citability: audit.citability,
    error: audit.error,
    plan,
    createdAt: audit.createdAt,
    updatedAt: audit.updatedAt,
  };

  return NextResponse.json(response);
}
