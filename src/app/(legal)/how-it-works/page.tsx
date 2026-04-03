import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How PagePulse Works | AI Content Audit Process",
  description:
    "Learn how PagePulse audits your content across 9 dimensions, calculates your Content Quality Score and AI Citability rating, and generates actionable recommendations.",
};

export default function HowItWorksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">
        How PagePulse works
      </h1>
      <p className="text-slate-400 mb-10 leading-relaxed">
        A detailed look at how PagePulse analyzes your content and produces
        actionable AI optimization recommendations.
      </p>

      {/* Step-by-step */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-6">
          The audit process, step by step
        </h2>
        <div className="space-y-6">
          {[
            {
              step: 1,
              title: "Submit your content",
              description:
                "Choose how you want to provide content for analysis. You have three options:",
              details: [
                "Paste a URL to any publicly accessible page. PagePulse fetches the content, strips away navigation, ads, sidebars, and boilerplate, leaving only the core article text.",
                "Paste your draft text directly. Perfect for auditing articles before they go live. Supports plain text and HTML.",
                "Upload a .docx file. Great for content drafted in Word or Google Docs. Text, headings, lists, and tables are extracted automatically.",
              ],
            },
            {
              step: 2,
              title: "AI analysis begins",
              description:
                "Once your content is submitted, PagePulse processes it through a multi-stage analysis pipeline:",
              details: [
                "The content is parsed and normalized into a clean text format with structural metadata preserved.",
                "GPT-4o evaluates the content across all 9 scoring dimensions, assessing everything from search intent alignment to authority signals.",
                "Each dimension receives a score from 1 to 10 based on evidence found in the content.",
                "The overall Content Quality Score (0-100) is calculated as a weighted average of all dimension scores.",
                "The AI Citability Score (0-10) is computed to predict how likely AI answer engines are to cite this content.",
              ],
            },
            {
              step: 3,
              title: "Report generation",
              description:
                "After scoring, PagePulse generates a detailed analysis report containing:",
              details: [
                "A breakdown of every dimension score with specific evidence and examples from your content.",
                "Prioritized recommendations ranked by potential impact on your content quality.",
                "BEFORE/AFTER rewrite examples pulled directly from your text, showing exactly what to change.",
                "An overall summary highlighting your content's strengths and the biggest areas for improvement.",
              ],
            },
            {
              step: 4,
              title: "Review and act",
              description:
                "Your audit results are available on your dashboard immediately after processing completes. From the results page you can:",
              details: [
                "View the full dimension-by-dimension breakdown with your Content Quality Score and AI Citability rating.",
                "Read the detailed analysis with specific fix recommendations.",
                "Download a professional PDF report to share with your team or clients.",
                "On the Pro plan, access a fully AI-revised version of your article with all recommended fixes applied.",
              ],
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-slate-950">
                    {item.step}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex gap-3 text-sm text-slate-300"
                      >
                        <svg
                          className="w-4 h-4 text-teal-400 shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What gets measured */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          What gets measured
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            Every audit evaluates your content across 9 research-backed
            dimensions. These dimensions were selected based on studies into how
            large language models evaluate, extract, and cite web content:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            {[
              { name: "CSI Alignment", focus: "Search intent match" },
              { name: "BLUF Quality", focus: "Answer placement" },
              { name: "Chunk Quality", focus: "Section structure" },
              { name: "URR Placement", focus: "Unique value props" },
              { name: "Cost of Retrieval", focus: "Extractability" },
              { name: "Information Density", focus: "Fact-to-filler ratio" },
              { name: "SRL Salience", focus: "Entity positioning" },
              { name: "TF-IDF Quality", focus: "Domain vocabulary" },
              { name: "E-E-A-T Signals", focus: "Authority markers" },
            ].map((dim) => (
              <div
                key={dim.name}
                className="rounded-lg border border-slate-700 bg-slate-800/30 px-4 py-3"
              >
                <div className="text-sm font-semibold text-slate-200">
                  {dim.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {dim.focus}
                </div>
              </div>
            ))}
          </div>
          <p className="pt-2">
            For a detailed explanation of each dimension including what it
            measures and why it matters, see the{" "}
            <Link href="/help#dimensions" className="text-teal-400 hover:underline">
              Help & Guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Processing time */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Processing time
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            Most audits complete in 30 to 60 seconds. The exact time depends on:
          </p>
          <ul className="space-y-2 text-slate-400">
            <li className="flex gap-3">
              <span className="text-teal-400 shrink-0">-</span>
              <span>
                <strong className="text-slate-300">Content length.</strong>{" "}
                Longer articles take slightly more time to analyze across all 9
                dimensions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 shrink-0">-</span>
              <span>
                <strong className="text-slate-300">Source type.</strong> URL
                audits include a fetch step. Paste and .docx audits skip this
                and go straight to analysis.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 shrink-0">-</span>
              <span>
                <strong className="text-slate-300">Report depth.</strong> The AI
                generates detailed recommendations and BEFORE/AFTER rewrites,
                which requires multiple analysis passes.
              </span>
            </li>
          </ul>
          <p>
            Your audit will appear as &quot;pending&quot; on the dashboard while
            processing. Once complete, the status changes to
            &quot;completed&quot; and all scores and recommendations become
            available.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          What you get in your report
        </h2>
        <div className="space-y-4">
          {[
            {
              title: "Content Quality Score (CQS)",
              description:
                "A single 0-100 metric representing the overall quality and AI-readiness of your content. This is the weighted average of all 9 dimension scores, giving you an at-a-glance measure of content health.",
            },
            {
              title: "AI Citability Score",
              description:
                "A 0-10 prediction of how likely AI answer engines are to cite your content as a source. This factors in structure, information density, authority signals, and extractability.",
            },
            {
              title: "Per-dimension breakdown",
              description:
                "Individual 1-10 scores for each of the 9 dimensions with specific observations from your content. This tells you exactly where your content is strong and where it needs work.",
            },
            {
              title: "Prioritized recommendations",
              description:
                "Actionable suggestions ranked by potential impact. High-weight dimensions that score low are flagged first because fixing those will move your overall score the most.",
            },
            {
              title: "BEFORE/AFTER rewrites",
              description:
                "Specific examples from your content showing the current text alongside a recommended revision. These are copy-ready; you can implement them directly in your article.",
            },
            {
              title: "AI-revised article (Pro plan)",
              description:
                "A complete rewrite of your article with all recommended fixes applied. This gives you a ready-to-publish version that implements every suggestion from the audit.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <h3 className="text-base font-semibold text-slate-200 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Requirements
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 text-sm text-slate-300">
          <p>To use PagePulse you need:</p>
          <ul className="space-y-2 text-slate-400">
            <li className="flex gap-3">
              <svg
                className="w-4 h-4 text-teal-400 shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                A free PagePulse account (sign up with email or Google).
              </span>
            </li>
            <li className="flex gap-3">
              <svg
                className="w-4 h-4 text-teal-400 shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Content to audit: a published URL, draft text (minimum 100
                characters), or a .docx file (maximum 10 MB).
              </span>
            </li>
            <li className="flex gap-3">
              <svg
                className="w-4 h-4 text-teal-400 shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                For URL audits, the page must be publicly accessible (no login
                required to view it).
              </span>
            </li>
          </ul>
          <p className="text-slate-400 pt-2">
            No API keys, integrations, or third-party accounts are required.
            PagePulse works entirely through the web dashboard.
          </p>
        </div>
      </section>

      {/* Data privacy */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Data privacy
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 text-sm text-slate-300 leading-relaxed">
          <ul className="space-y-2 text-slate-400">
            <li className="flex gap-3">
              <svg
                className="w-4 h-4 text-emerald-400 shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span>
                Your content is stored only for your own access. It is never
                shared with other users, third parties, or used to train AI
                models.
              </span>
            </li>
            <li className="flex gap-3">
              <svg
                className="w-4 h-4 text-emerald-400 shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span>
                Each user's audits are fully isolated. You can only view your
                own audit history and reports.
              </span>
            </li>
            <li className="flex gap-3">
              <svg
                className="w-4 h-4 text-emerald-400 shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span>
                You can delete any audit from your dashboard at any time. All
                associated data is permanently removed.
              </span>
            </li>
          </ul>
          <p className="pt-2">
            For complete details, see our{" "}
            <Link href="/privacy" className="text-teal-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-100 mb-3">
            Ready to audit your content?
          </h2>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            Start with 2 free audits. See exactly what to fix so AI search
            engines cite your content as a source.
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold transition text-sm"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
