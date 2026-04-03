import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { runAudit } from "@/lib/audit-engine";

async function getUser() {
  const session = await auth();
  return session?.user?.id;
}

export async function POST(req: NextRequest) {
  const userId = await getUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check content type for file uploads vs JSON
  const contentType = req.headers.get("content-type") || "";

  let sourceType: "url" | "paste" | "docx" = "url";
  let url = "";
  let content = "";
  let title = "";

  if (contentType.includes("multipart/form-data")) {
    // File upload (.docx)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (
      !fileName.endsWith(".docx") &&
      !file.type.includes(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      return NextResponse.json(
        { error: "Only .docx files are supported. Please upload a Word document." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Parse .docx
    const { parseDocx } = await import("@/lib/docx-parser");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const parsed = await parseDocx(buffer);
      content = parsed.content;
      title = formData.get("title")?.toString() || parsed.title;
    } catch {
      return NextResponse.json(
        { error: "Failed to parse .docx file. The file may be corrupted." },
        { status: 400 }
      );
    }

    if (!content.trim()) {
      return NextResponse.json(
        { error: "The uploaded document appears to be empty." },
        { status: 400 }
      );
    }

    sourceType = "docx";
    url = `upload://${file.name}`;
  } else {
    // JSON body (URL or paste)
    let body: { url?: string; content?: string; title?: string; sourceType?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (body.sourceType === "paste") {
      // Paste mode
      if (!body.content || typeof body.content !== "string" || !body.content.trim()) {
        return NextResponse.json(
          { error: "Content is required for paste mode" },
          { status: 400 }
        );
      }

      // Minimum content length check
      if (body.content.trim().length < 100) {
        return NextResponse.json(
          { error: "Content is too short. Please provide at least 100 characters for a meaningful audit." },
          { status: 400 }
        );
      }

      sourceType = "paste";
      content = body.content.trim();
      title = body.title?.trim() || "Pasted Draft";
      url = "paste://draft";
    } else {
      // URL mode (default)
      if (!body.url || typeof body.url !== "string") {
        return NextResponse.json(
          { error: "A valid URL is required" },
          { status: 400 }
        );
      }

      try {
        new URL(body.url);
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 }
        );
      }

      sourceType = "url";
      url = body.url;
    }
  }

  // Check subscription limits
  const subscription = await db.subscription.findUnique({
    where: { userId },
  });

  const auditsUsed = subscription?.auditsUsed ?? 0;
  const auditsLimit = subscription?.auditsLimit ?? 2;

  if (auditsUsed >= auditsLimit) {
    return NextResponse.json(
      {
        error: "Audit limit reached. Please upgrade your plan for more audits.",
      },
      { status: 403 }
    );
  }

  // Create audit record
  const audit = await db.audit.create({
    data: {
      userId,
      url,
      sourceType,
      title: sourceType !== "url" ? title : undefined,
      status: "pending",
    },
  });

  // Increment auditsUsed
  if (subscription) {
    await db.subscription.update({
      where: { userId },
      data: { auditsUsed: auditsUsed + 1 },
    });
  } else {
    await db.subscription.create({
      data: {
        userId,
        plan: "free",
        auditsUsed: 1,
        auditsLimit: 2,
      },
    });
  }

  const plan = subscription?.plan || "free";

  // Fire and forget: kick off the audit pipeline
  runAudit(
    sourceType === "url"
      ? url
      : { content, title, sourceType },
    audit.id,
    plan
  );

  return NextResponse.json({ auditId: audit.id }, { status: 201 });
}
