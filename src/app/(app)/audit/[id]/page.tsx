"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DIMENSIONS } from "@/lib/dimensions";

function markdownToHtml(markdown: string): string {
  // Convert markdown to clean HTML for blog editors
  let html = markdown;
  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  // Paragraphs - wrap non-tag lines
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, '<p>$1</p>');
  // Clean up empty lines
  html = html.replace(/\n{3,}/g, '\n\n');
  return html.trim();
}

interface DimensionScore {
  score: number;
  summary: string;
  issues: string[];
}

interface Scores {
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

interface Audit {
  id: string;
  url: string;
  sourceType: "url" | "paste" | "docx";
  title: string | null;
  status: string;
  scores: Scores | null;
  report: string | null;
  revisedContent: string | null;
  cqs: number | null;
  citability: number | null;
  error: string | null;
  plan: string;
  createdAt: string;
}

const urlSteps = ["fetching", "scoring", "generating", "completed"];
const directSteps = ["scoring", "generating", "completed"];

const stepSublabels: Record<string, string> = {
  fetching: "Fetching content...",
  scoring: "Scoring 9 dimensions...",
  generating: "Writing report...",
  completed: "Done!",
};

function getSteps(sourceType?: string) {
  return sourceType === "paste" || sourceType === "docx"
    ? directSteps
    : urlSteps;
}

function stepIndex(status: string, steps: string[]) {
  const i = steps.indexOf(status);
  return i >= 0 ? i : -1;
}

function scoreBarColor(score: number) {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 6) return "bg-amber-400";
  if (score >= 4) return "bg-amber-600";
  return "bg-rose-500";
}

function cqsColor(score: number) {
  if (score >= 81) return "text-emerald-400";
  if (score >= 61) return "text-amber-300";
  if (score >= 41) return "text-amber-500";
  return "text-rose-400";
}

function cqsRingColor(score: number) {
  if (score >= 81) return "stroke-emerald-500";
  if (score >= 61) return "stroke-amber-400";
  if (score >= 41) return "stroke-amber-500";
  return "stroke-rose-500";
}

function getDimensionMeta(key: string) {
  return DIMENSIONS.find((d) => d.key === key);
}

export default function AuditPage() {
  const params = useParams();
  const id = params.id as string;
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"scores" | "report" | "revised">(
    "scores"
  );
  const [shouldPoll, setShouldPoll] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [generatingRevised, setGeneratingRevised] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [copyHtmlLabel, setCopyHtmlLabel] = useState("Copy HTML");
  const revisedRef = useRef<HTMLDivElement>(null);

  const fetchAudit = useCallback(async () => {
    try {
      const res = await fetch(`/api/audit/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAudit(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  useEffect(() => {
    if (!shouldPoll) return;
    const interval = setInterval(fetchAudit, 3000);
    return () => clearInterval(interval);
  }, [fetchAudit, shouldPoll]);

  useEffect(() => {
    if (audit?.status === "completed" || audit?.status === "failed") {
      setShouldPoll(false);
    }
  }, [audit?.status]);

  async function handleDownloadPdf() {
    if (!audit) return;
    setDownloadingPdf(true);
    try {
      const { generateAuditPDF } = await import("@/lib/generate-pdf");
      generateAuditPDF({
        url: audit.url,
        title: audit.title,
        cqs: audit.cqs,
        citability: audit.citability,
        scores: audit.scores
          ? Object.fromEntries(
              Object.entries(audit.scores).map(([k, v]) => [
                k,
                (v as DimensionScore).score,
              ])
            )
          : null,
        report: audit.report,
        revisedContent: audit.revisedContent,
        plan: audit.plan,
        createdAt: audit.createdAt,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloadingPdf(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg
          className="animate-spin h-8 w-8 text-teal-400"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="text-center py-24">
        <h2 className="text-lg text-slate-300">Audit not found</h2>
        <Link
          href="/dashboard"
          className="text-sm text-teal-400 hover:text-teal-300 mt-2 inline-block"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const isProcessing = !["completed", "failed"].includes(audit.status);
  const steps = getSteps(audit.sourceType);
  const currentStep = stepIndex(audit.status, steps);
  const scores: Scores | null = audit.scores || null;
  const isPro = audit.plan === "pro";
  const isFree = audit.plan === "free";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-slate-300 mb-3 inline-block"
          >
            &larr; Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-100 truncate">
              {audit.title || "Content Audit"}
            </h1>
            {audit.sourceType && audit.sourceType !== "url" && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                  audit.sourceType === "paste"
                    ? "bg-violet-500/15 text-violet-400 border border-violet-500/30"
                    : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                }`}
              >
                {audit.sourceType === "paste" ? "Draft" : ".docx"}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 truncate">
            {audit.sourceType === "paste"
              ? "Pasted draft content"
              : audit.sourceType === "docx"
              ? `Uploaded: ${audit.url.replace("upload://", "")}`
              : audit.url}
          </p>
        </div>
        {audit.status === "completed" && (
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="shrink-0 ml-4 mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {downloadingPdf ? "Generating..." : "Download PDF"}
          </button>
        )}
      </div>

      {/* Progress */}
      {isProcessing && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="animate-spin h-4 w-4 text-teal-400"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-teal-400 font-medium">
              Processing audit...
            </span>
            <span className="text-xs text-slate-500 ml-auto">
              Usually takes 30-60 seconds
            </span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex-1 h-1.5 rounded-full ${
                      i <= currentStep ? "bg-teal-500" : "bg-slate-800"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      i === currentStep
                        ? "text-teal-400"
                        : i < currentStep
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
                <span
                  className={`text-[10px] ${
                    i === currentStep
                      ? "text-teal-400/70"
                      : i < currentStep
                      ? "text-slate-500"
                      : "text-slate-700"
                  }`}
                >
                  {stepSublabels[step]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {audit.status === "failed" && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 mb-6">
          <h3 className="text-sm font-medium text-rose-400 mb-1">
            Audit failed
          </h3>
          <p className="text-sm text-rose-300/70">
            {audit.error || "An unknown error occurred"}
          </p>
          <button
            onClick={() => (window.location.href = "/audit/new")}
            className="mt-3 text-sm text-teal-400 hover:text-teal-300 transition"
          >
            Try again with a new audit
          </button>
        </div>
      )}

      {/* Scores Summary */}
      {audit.status === "completed" && audit.cqs !== null && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* CQS Ring */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-28 h-28">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                className={cqsRingColor(audit.cqs)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(audit.cqs / 100) * 314} 314`}
                transform="rotate(-90 60 60)"
              />
              <text
                x="60"
                y="55"
                textAnchor="middle"
                className={`text-3xl font-bold fill-current ${cqsColor(audit.cqs)}`}
                fontSize="28"
                fontWeight="bold"
              >
                {Math.round(audit.cqs)}
              </text>
              <text
                x="60"
                y="75"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
              >
                CQS
              </text>
            </svg>
            <div className="text-sm text-slate-400 mt-2">
              Content Quality Score
            </div>
          </div>

          {/* Citability */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col items-center justify-center">
            <div
              className={`text-5xl font-bold ${cqsColor((audit.citability || 0) * 10)}`}
            >
              {audit.citability?.toFixed(1) || "N/A"}
            </div>
            <div className="text-sm text-slate-400 mt-2">
              AI Citability Score
            </div>
            <div className="text-xs text-slate-500 mt-1">out of 10</div>
          </div>

          {/* Quick stats */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="text-sm text-slate-400 mb-3">Dimensions Scored</div>
            {scores && (
              <div className="space-y-2">
                {Object.entries(scores)
                  .slice(0, 5)
                  .map(([key, dim]) => {
                    const meta = getDimensionMeta(key);
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-20 text-xs text-slate-500 truncate">
                          {meta?.acronym
                            ? meta.acronym
                            : meta?.fullName.split(" ")[0] || key}
                        </div>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${scoreBarColor(dim.score)}`}
                            style={{ width: `${dim.score * 10}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-300 w-5 text-right">
                          {dim.score}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      {audit.status === "completed" && (
        <>
          <div className="flex gap-1 mb-4 border-b border-slate-800">
            <button
              onClick={() => setActiveTab("scores")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "scores"
                  ? "text-teal-400 border-teal-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              Dimension Scores
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "report"
                  ? "text-teal-400 border-teal-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              Full Report
            </button>
            <button
              onClick={() => setActiveTab("revised")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "revised"
                  ? "text-teal-400 border-teal-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              Revised Article
              {!isPro && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                  PRO
                </span>
              )}
            </button>
          </div>

          {/* Dimension Scores Tab */}
          {activeTab === "scores" && scores && (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(scores).map(([key, dim]) => {
                const meta = getDimensionMeta(key);
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-slate-200">
                        {meta?.fullName || key}
                      </h3>
                      <span
                        className={`text-lg font-bold ${
                          dim.score >= 8
                            ? "text-emerald-400"
                            : dim.score >= 6
                            ? "text-amber-400"
                            : dim.score >= 4
                            ? "text-amber-600"
                            : "text-rose-400"
                        }`}
                      >
                        {dim.score}/10
                      </span>
                    </div>
                    {meta?.acronym && (
                      <div className="text-xs text-slate-500 mb-2">
                        {meta.acronym}
                      </div>
                    )}
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full ${scoreBarColor(dim.score)}`}
                        style={{ width: `${dim.score * 10}%` }}
                      />
                    </div>
                    {meta && (
                      <p className="text-xs text-teal-400/70 mb-2 italic">
                        Why it matters: {meta.whyItMatters}
                      </p>
                    )}
                    <p className="text-sm text-slate-400 mb-3">{dim.summary}</p>
                    {dim.issues.length > 0 && (
                      <div className="space-y-1">
                        {dim.issues.map((issue: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-500"
                          >
                            <span className="text-rose-400 mt-0.5">!</span>
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Report Tab */}
          {activeTab === "report" && audit.report && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
              <div className="audit-report">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {audit.report}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Revised Article Tab */}
          {activeTab === "revised" && (
            <>
              {audit.revisedContent ? (
                /* Show the revised article */
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">
                        AI-Optimized Article
                      </h3>
                      <p className="text-sm text-slate-400">
                        Your content rewritten with all recommendations applied
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const html = markdownToHtml(audit.revisedContent || "");
                          navigator.clipboard.writeText(html);
                          setCopyHtmlLabel("Copied!");
                          setTimeout(() => setCopyHtmlLabel("Copy HTML"), 2000);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-300 hover:border-slate-600 hover:text-slate-200 transition"
                        title="Copy as HTML — paste directly into Shopify or any blog editor"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                          />
                        </svg>
                        {copyHtmlLabel}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            audit.revisedContent || ""
                          );
                          setCopyLabel("Copied!");
                          setTimeout(() => setCopyLabel("Copy"), 2000);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-300 hover:border-slate-600 hover:text-slate-200 transition"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        {copyLabel}
                      </button>
                    </div>
                  </div>
                  <div className="audit-report" ref={revisedRef}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="text-2xl font-bold text-slate-100 mt-8 mb-4">{children}</h1>,
                        h2: ({children}) => <h2 className="text-xl font-bold text-slate-100 mt-6 mb-3">{children}</h2>,
                        h3: ({children}) => <h3 className="text-lg font-semibold text-slate-200 mt-5 mb-2">{children}</h3>,
                        h4: ({children}) => <h4 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h4>,
                        p: ({children}) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-4 text-slate-300 ml-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-4 text-slate-300 ml-2">{children}</ol>,
                        li: ({children}) => <li className="text-slate-300 leading-relaxed">{children}</li>,
                        strong: ({children}) => <strong className="font-bold text-slate-100">{children}</strong>,
                        em: ({children}) => <em className="italic text-slate-200">{children}</em>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-teal-500 pl-4 my-4 text-slate-400 italic">{children}</blockquote>,
                        a: ({href, children}) => <a href={href} className="text-teal-400 hover:text-teal-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        hr: () => <hr className="border-slate-700 my-6" />,
                        table: ({children}) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse border border-slate-700 text-sm">{children}</table></div>,
                        thead: ({children}) => <thead className="bg-slate-800">{children}</thead>,
                        th: ({children}) => <th className="border border-slate-700 px-3 py-2 text-left text-slate-200 font-semibold">{children}</th>,
                        td: ({children}) => <td className="border border-slate-700 px-3 py-2 text-slate-300">{children}</td>,
                      }}
                    >
                      {audit.revisedContent}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : isPro ? (
                /* Pro user but no revised content yet: offer to generate */
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 md:p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-teal-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-3">
                    Generate your AI-optimized article
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-2">
                    As a Pro user, you can generate a fully revised version of
                    this content with all audit recommendations applied.
                  </p>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                    This usually takes 30 to 60 seconds.
                  </p>
                  <button
                    onClick={async () => {
                      setGeneratingRevised(true);
                      try {
                        const res = await fetch(
                          `/api/audit/${audit.id}/revise`,
                          { method: "POST" }
                        );
                        if (res.ok) {
                          const data = await res.json();
                          setAudit({
                            ...audit,
                            revisedContent: data.revisedContent,
                          });
                        } else {
                          const data = await res.json();
                          alert(
                            data.error ||
                              "Failed to generate revised article."
                          );
                        }
                      } catch {
                        alert("Failed to generate revised article.");
                      } finally {
                        setGeneratingRevised(false);
                      }
                    }}
                    disabled={generatingRevised}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold transition text-sm disabled:opacity-50"
                  >
                    {generatingRevised ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Generating revised article...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                          />
                        </svg>
                        Generate Revised Article
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Non-pro user: upsell CTA */
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 md:p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-3">
                    Get your AI-optimized article
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-2">
                    Pro plan users receive a fully revised version of their
                    content with all audit recommendations already applied.
                  </p>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                    Copy, paste, and publish. No manual rewriting needed.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold transition text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    Upgrade to Pro
                  </Link>
                  <p className="text-xs text-slate-600 mt-4">
                    Available on the Pro plan and above
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
