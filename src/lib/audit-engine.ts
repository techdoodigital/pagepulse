import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { fetchUrlAsMarkdown } from "@/lib/jina-reader";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DimensionScore {
  score: number; // 0-10
  summary: string; // 1-2 sentence explanation
  issues: string[]; // specific problems found
}

export interface ScoreResult {
  csiAlignment: DimensionScore;
  blufQuality: DimensionScore;
  chunkQuality: DimensionScore;
  urrPlacement: DimensionScore;
  costOfRetrieval: DimensionScore;
  informationDensity: DimensionScore;
  srlSalience: DimensionScore;
  tfidfQuality: DimensionScore;
  eeat: DimensionScore;
}

export interface ReportResult {
  cqs: number;
  citability: number;
  report: string; // full markdown report
}

// ---------------------------------------------------------------------------
// Anthropic client
// ---------------------------------------------------------------------------

function getAnthropicClient() {
  let apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env");
      const envContent = fs.readFileSync(envPath, "utf8");
      const match = envContent.match(/^ANTHROPIC_API_KEY=(.+)$/m);
      if (match) apiKey = match[1].replace(/^["']|["']$/g, "").trim();
    } catch {
      // ignore
    }
  }
  return new Anthropic({ apiKey });
}

const anthropic = getAnthropicClient();
const MODEL = "claude-sonnet-4-20250514";

// ---------------------------------------------------------------------------
// Scoring prompt
// ---------------------------------------------------------------------------

const SCORING_SYSTEM_PROMPT = `You are an expert content auditor specializing in semantic content analysis for AI Search optimization. You evaluate web content across 9 scientifically-grounded dimensions derived from the Content Audit OS methodology.

For each dimension, assign a score from 0 (worst) to 10 (best) along with a 1-2 sentence summary and a list of specific issues found.

## Dimension Definitions

### 1. csiAlignment: Central Search Intent Alignment (Weight: High)
Measures how well the content satisfies the dominant user intent behind the query the page targets.
- 10: The content unambiguously answers the primary question a searcher would have. Every section reinforces the central intent.
- 5: The content partially addresses the intent but drifts into tangential topics or buries the core answer.
- 0: The content fails to address the likely search intent or answers a different question entirely.

Evaluate: Does the page have a single, clear Central Search Intent? Is it answered within the first 20% of the content? Do all sections serve that intent?

### 2. blufQuality: Bottom Line Up Front (Weight: Medium-High)
Measures whether the key takeaway or definitive answer appears at the very top of the content, before any supporting detail.
- 10: The first paragraph contains a direct, concise answer to the CSI. A reader (or AI) can extract the answer without scrolling.
- 5: The answer appears but is buried under introductions, definitions, or preamble.
- 0: The content uses an inverted structure (background first, answer last) or never provides a clear bottom-line answer.

Evaluate: Can you extract the definitive answer from the first 150 words? Is there unnecessary preamble before the core answer?

### 3. chunkQuality: Section Autonomy & Chunk Sizing
Measures whether each section (H2/H3 block) can stand alone as a self-contained, citable unit of information.
- 10: Every section has a descriptive heading, is 80-200 words, and makes sense if extracted in isolation. Zero orphan paragraphs.
- 5: Some sections are autonomous but others depend on prior context, are too long (>300 words), or have vague headings.
- 0: Content is a wall of text with no meaningful structure, or sections are so fragmented they lack context.

Evaluate: Are headings descriptive (not "Introduction" or "More Info")? Can each section be quoted out of context? Are sections appropriately sized?

### 4. urrPlacement: Attribute Prioritization (Unique, Rare, Remarkable)
Measures whether the content leads with its most distinctive, hard-to-find information rather than generic common knowledge.
- 10: The most unique, rare, or remarkable claims appear in the first third. The content offers information not easily found elsewhere.
- 5: Some unique insights exist but are buried in the middle or end. The opening is generic.
- 0: The content is entirely composed of widely-available, commodity information with nothing distinctive.

Evaluate: Does the content contain proprietary data, original research, unique frameworks, or first-hand experience? Is this unique material placed prominently?

### 5. costOfRetrieval: Structure & Formatting Quality
Measures how efficiently a reader (human or AI) can extract specific facts from the content.
- 10: Excellent use of tables, bullet lists, numbered steps, bold key terms, and summary boxes. Any fact can be found in <5 seconds.
- 5: Some structural aids exist but key information is locked in dense paragraphs.
- 0: Pure prose with no structural formatting. Extracting a specific fact requires reading the entire document.

Evaluate: Are comparisons in tables? Are steps numbered? Are key terms bolded? Are there summary/TL;DR sections? Is the content scannable?

### 6. informationDensity: Fact-to-Filler Ratio
Measures the ratio of concrete, verifiable facts to filler content (fluff phrases, redundancy, obvious statements).
- 10: Every sentence adds new, specific, verifiable information. Zero filler phrases. High data-to-word ratio.
- 5: Mix of useful facts and filler. Some redundancy and generic statements.
- 0: Content is mostly filler (vague claims, repeated points, marketing fluff) with very few concrete facts.

Evaluate: Count filler phrases ("it's important to note", "in today's world", "as we all know"). Look for redundant paragraphs. Check for specific numbers, dates, names, and verifiable claims.

### 7. srlSalience: Semantic Role Labeling / Entity as Agent
Measures whether the central entity (product, brand, concept) is positioned as the grammatical Agent (doer) rather than Patient (receiver) in key sentences.
- 10: The subject entity consistently appears as the grammatical subject performing actions. Active voice dominates. The entity drives the narrative.
- 5: Mixed: sometimes the entity is agent, sometimes patient. Passive voice appears frequently.
- 0: The entity is consistently the patient/object, or the writing is so passive that no clear agent emerges.

Evaluate: In sentences about the main topic, is it the subject (agent) or object (patient)? What percentage uses active vs. passive voice?

### 8. tfidfQuality: Specialized vs. Generic Terminology
Measures whether the content uses domain-specific, high-TF-IDF terminology that signals expertise, rather than generic everyday language.
- 10: Rich in domain-specific terms, technical vocabulary, and specialized phrases that an expert would use. Appropriate jargon with context.
- 5: Some specialized terms but mostly generic language. A non-expert could have written it.
- 0: Entirely generic vocabulary. No domain-specific terminology. Could be about any topic.

Evaluate: Would domain experts find the terminology appropriate? Are specialized terms defined when first used? Is there a good density of topic-specific n-grams?

### 9. eeat: Experience, Expertise, Authoritativeness, Trustworthiness
Measures the presence of E-E-A-T signals within the content itself.
- 10: Clear author attribution with credentials, first-hand experience markers ("in my 10 years of..."), cited sources, specific data with provenance, methodology descriptions.
- 5: Some authority signals but missing key elements (no author, no sources, or no experience markers).
- 0: Anonymous content with no sources, no experience signals, no credentials, and no verifiable claims.

Evaluate: Is there an author with visible credentials? Are claims sourced? Are there first-person experience markers? Is methodology explained? Are there dates and update timestamps?

## Output Format

Respond with ONLY a valid JSON object (no markdown code fences, no extra text) with this exact structure:

{
  "csiAlignment": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": ["<issue1>", "<issue2>"] },
  "blufQuality": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": ["<issue1>"] },
  "chunkQuality": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": [] },
  "urrPlacement": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": [] },
  "costOfRetrieval": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": [] },
  "informationDensity": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": [] },
  "srlSalience": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": [] },
  "tfidfQuality": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": [] },
  "eeat": { "score": <0-10>, "summary": "<1-2 sentences>", "issues": [] }
}

Be rigorous and honest. Most real-world content scores between 3-7 on each dimension. Reserve 9-10 for truly exceptional content and 0-2 for genuinely poor content.`;

// ---------------------------------------------------------------------------
// Report generation prompt
// ---------------------------------------------------------------------------

const REPORT_SYSTEM_PROMPT = `You are an expert content strategist producing a comprehensive audit report for AI Search optimization. You receive the original content (in markdown) and the per-dimension scores. Your job is to produce a detailed, actionable audit report in markdown format.

## Report Structure

Produce a report with ALL of the following sections:

### 1. Executive Summary
- 3-4 sentences summarizing overall content quality
- State the CQS (Content Quality Score) and AI Citability Score prominently
- Identify the single biggest strength and single biggest weakness

### 2. Score Overview Table
A markdown table with columns: Dimension | Score | Weight | Weighted Score
Include all 9 dimensions plus the total CQS.

### 3. Per-Dimension Deep Dive
For EACH of the 9 dimensions, include:
- **Score: X/10** with the summary
- **Issues Found:** bulleted list of specific problems
- **BEFORE (Current):** Quote an actual problematic passage from the content (use > blockquote)
- **AFTER (Recommended):** Show a rewritten version that fixes the issues (use > blockquote)
- Keep BEFORE/AFTER examples concrete and taken from the actual content. Do NOT invent generic examples

### 4. AI Citability Assessment
- Explain what makes content citable by AI systems (LLMs, AI search engines)
- Score the content's citability 0-10
- List specific elements that help or hurt citability

### 5. Prioritized Action Plan
Group all recommendations into:
- **CRITICAL** (score < 4): Must fix. These actively hurt discoverability
- **HIGH** (score 4-6): Should fix. Significant improvement opportunity
- **MEDIUM** (score 7-8): Nice to have. Polish and refinement

Each recommendation should be specific and actionable (not "improve headings" but "Change H2 'More Info' on line ~45 to 'Pricing Comparison for Enterprise Plans'").

### 6. Quick Wins
List 3-5 changes that can be made in under 15 minutes for maximum impact.

## Guidelines
- Be specific: reference actual content from the page
- Be direct: no hedging or excessive praise
- Prioritize actionability: every observation should have a corresponding recommendation
- Use markdown formatting for readability (tables, bold, blockquotes, lists)
- The report should be 1500-3000 words`;

// ---------------------------------------------------------------------------
// scoreContent
// ---------------------------------------------------------------------------

export async function scoreContent(content: string): Promise<ScoreResult> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SCORING_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze the following web page content and score it across all 9 dimensions.\n\n---\n\n${content}`,
      },
    ],
  });

  const responseText = response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON: handle possible markdown code fences
  const cleaned = responseText
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();

  const scores: ScoreResult = JSON.parse(cleaned);
  return scores;
}

// ---------------------------------------------------------------------------
// generateReport
// ---------------------------------------------------------------------------

export async function generateReport(
  content: string,
  scores: ScoreResult
): Promise<ReportResult> {
  // Calculate CQS
  const cqs =
    (scores.csiAlignment.score * 0.25 +
      scores.costOfRetrieval.score * 0.2 +
      scores.informationDensity.score * 0.15 +
      scores.srlSalience.score * 0.1 +
      scores.tfidfQuality.score * 0.1 +
      scores.eeat.score * 0.2) *
    10;

  const scoresJson = JSON.stringify(scores, null, 2);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: REPORT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `## Pre-Calculated Scores\n\nCQS (Content Quality Score): ${cqs.toFixed(1)} / 100\n\nDimension Scores:\n\`\`\`json\n${scoresJson}\n\`\`\`\n\n## Original Content\n\n---\n\n${content}`,
      },
    ],
  });

  const reportText = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract citability score from the report
  let citability = 5; // default
  const citabilityMatch = reportText.match(
    /(?:citability|cit\w+)\s*(?:score)?[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i
  );
  if (citabilityMatch) {
    citability = parseFloat(citabilityMatch[1]);
  }

  return {
    cqs: Math.round(cqs * 10) / 10,
    citability,
    report: reportText,
  };
}

// ---------------------------------------------------------------------------
// generateRevisedArticle: rewrite article for maximum AI citability (pro only)
// ---------------------------------------------------------------------------

const REVISED_ARTICLE_SYSTEM_PROMPT = `You are an expert content editor specializing in AI Search Optimization (AEO/GEO).
You will receive an article and its scores across 9 content quality dimensions.

Your task: Rewrite the article implementing ALL improvements to maximize AI citability.

Rules:
- Maintain the original topic, facts, and intent
- Improve structure: lead with the answer (BLUF), use clear headings, add lists/tables where appropriate
- Increase information density: remove filler, add specificity, replace vague claims with concrete data
- Strengthen E-E-A-T signals: add attribution, cite sources where possible, use authoritative language
- Make the entity the grammatical subject of key sentences (SRL improvement)
- Use domain-specific terminology instead of generic language (TF-IDF improvement)
- Ensure each section is self-contained and extractable (chunk quality)
- Place unique, rare, and remarkable facts prominently (URR placement)
- Format for easy retrieval: use tables, numbered lists, clear headers
- Do NOT add fabricated statistics or fake citations
- Do NOT change the core message or add information that was not in the original
- Output the revised article in clean markdown format`;

export async function generateRevisedArticle(
  content: string,
  scores: ScoreResult
): Promise<string> {
  const scoresJson = JSON.stringify(scores, null, 2);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: REVISED_ARTICLE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `## Dimension Scores\n\n\`\`\`json\n${scoresJson}\n\`\`\`\n\n## Original Article\n\n---\n\n${content}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

// ---------------------------------------------------------------------------
// runAudit: full pipeline orchestrator
// ---------------------------------------------------------------------------

export interface AuditInput {
  url?: string;
  content?: string; // pre-provided content (paste or docx)
  title?: string; // pre-provided title (paste or docx)
  sourceType?: "url" | "paste" | "docx";
}

export async function runAudit(
  urlOrInput: string | AuditInput,
  auditId: string,
  userPlan: string = "free"
): Promise<void> {
  // Normalize input: support both legacy string (url) and new object format
  const input: AuditInput =
    typeof urlOrInput === "string"
      ? { url: urlOrInput, sourceType: "url" }
      : urlOrInput;

  try {
    let title: string;
    let content: string;

    if (input.sourceType === "paste" || input.sourceType === "docx") {
      // Content already provided - skip fetch step
      await db.audit.update({
        where: { id: auditId },
        data: { status: "scoring" },
      });

      content = input.content || "";
      title = input.title || "Untitled Draft";
    } else {
      // URL mode: fetch content via Jina
      await db.audit.update({
        where: { id: auditId },
        data: { status: "fetching" },
      });

      const fetched = await fetchUrlAsMarkdown(input.url!);
      title = fetched.title;
      content = fetched.content;
    }

    // Save source content
    await db.audit.update({
      where: { id: auditId },
      data: {
        title,
        sourceContent: content,
        status: "scoring",
      },
    });

    // Step 3: Score content
    const scores = await scoreContent(content);

    await db.audit.update({
      where: { id: auditId },
      data: {
        scores: JSON.stringify(scores),
        status: "generating",
      },
    });

    // Step 4: Generate report
    const { cqs, citability, report } = await generateReport(content, scores);

    await db.audit.update({
      where: { id: auditId },
      data: {
        report,
        cqs,
        citability,
        status: userPlan === "pro" ? "generating" : "completed",
      },
    });

    // Step 5: Generate revised article (pro plan only)
    if (userPlan === "pro") {
      try {
        const revisedContent = await generateRevisedArticle(content, scores);
        await db.audit.update({
          where: { id: auditId },
          data: {
            revisedContent,
            status: "completed",
          },
        });
      } catch (reviseError) {
        // If revised article fails, still mark audit as completed (report is done)
        console.error("Failed to generate revised article:", reviseError);
        await db.audit.update({
          where: { id: auditId },
          data: { status: "completed" },
        });
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    // Truncate error message to avoid storing huge content in the error field
    const truncatedMessage = message.length > 500 ? message.slice(0, 500) + "..." : message;
    await db.audit.update({
      where: { id: auditId },
      data: {
        status: "failed",
        error: truncatedMessage,
      },
    });
  }
}
