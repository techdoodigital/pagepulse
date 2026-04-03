import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function getUserId(): Promise<string | undefined> {
  const session = await auth();
  return session?.user?.id;
}

const VALID_CATEGORIES = ["bug", "feature_request", "billing", "account", "other"];
const VALID_PRIORITIES = ["low", "medium", "high"];

export async function POST(req: NextRequest) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    subject?: string;
    description?: string;
    category?: string;
    priority?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { subject, description, category, priority } = body;

  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    return NextResponse.json(
      { error: "Subject is required" },
      { status: 400 }
    );
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 20
  ) {
    return NextResponse.json(
      { error: "Description must be at least 20 characters" },
      { status: 400 }
    );
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  const ticketPriority =
    priority && VALID_PRIORITIES.includes(priority) ? priority : "medium";

  const ticket = await db.supportTicket.create({
    data: {
      userId,
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority: ticketPriority,
    },
  });

  return NextResponse.json({ ticket }, { status: 201 });
}

export async function GET() {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tickets = await db.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tickets });
}
