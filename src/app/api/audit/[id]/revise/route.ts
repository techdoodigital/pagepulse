import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateRevisedArticle } from "@/lib/audit-engine";

export async function POST(
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

  // Check user is on pro plan
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || subscription.plan !== "pro") {
    return NextResponse.json(
      { error: "This feature is available on the Pro plan." },
      { status: 403 }
    );
  }

  // Must have source content and scores
  if (!audit.sourceContent || !audit.scores) {
    return NextResponse.json(
      { error: "Audit must be completed before generating a revised article." },
      { status: 400 }
    );
  }

  // Already has revised content
  if (audit.revisedContent) {
    return NextResponse.json({ revisedContent: audit.revisedContent });
  }

  try {
    const scores = JSON.parse(audit.scores);
    const revisedContent = await generateRevisedArticle(
      audit.sourceContent,
      scores
    );

    await db.audit.update({
      where: { id },
      data: { revisedContent },
    });

    return NextResponse.json({ revisedContent });
  } catch (err) {
    console.error("Failed to generate revised article:", err);
    return NextResponse.json(
      { error: "Failed to generate revised article. Please try again." },
      { status: 500 }
    );
  }
}
