import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "What is Answer Engine Optimization (AEO)? | PagePulse",
  description:
    "Learn what Answer Engine Optimization is, why it matters for content visibility in AI-powered search, and how PagePulse helps you optimize for AI citability.",
};

export default function WhatIsAEOPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">
        What is Answer Engine Optimization (AEO)?
      </h1>
      <p className="text-slate-400 mb-10 leading-relaxed">
        A practical guide to optimizing content for AI-powered search engines
        like ChatGPT, Perplexity, and Google AI Overviews.
      </p>

      {/* The shift */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          The shift from SEO to AEO
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            For two decades, search engine optimization (SEO) focused on ranking
            in the blue links. You optimized title tags, built backlinks, and
            targeted keywords. The goal was position 1 on page 1.
          </p>
          <p>
            That model is changing. AI-powered answer engines now synthesize
            responses from multiple sources and present them directly to the
            user. Instead of clicking through to a webpage, users get a
            generated answer with cited sources. If your content is not
            structured for these systems, it gets skipped entirely regardless of
            your traditional ranking.
          </p>
          <p>
            Answer Engine Optimization is the practice of structuring content so
            AI answer engines can easily extract, understand, and cite it. It is
            not a replacement for SEO. It is an additional layer that determines
            whether your content gets referenced in AI-generated responses.
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Why AEO matters now
        </h2>
        <div className="grid gap-4">
          {[
            {
              title: "AI search is growing rapidly",
              body: "Perplexity, ChatGPT with search, Google AI Overviews, and Microsoft Copilot are processing billions of queries. These platforms generate answers by pulling from and citing web content. If your pages are not optimized for extraction, they will not be cited.",
            },
            {
              title: "Zero-click is becoming the default",
              body: "Users increasingly get their answers without clicking through to any website. The only way to maintain visibility is to become the source that AI systems cite in their responses. Being cited means your brand and URL appear in front of users even without a traditional click.",
            },
            {
              title: "Traditional SEO alone is not enough",
              body: "Ranking on page 1 no longer guarantees traffic. If an AI overview answers the query above the search results, users may never scroll to the blue links. AEO ensures your content is the source behind those AI-generated answers.",
            },
            {
              title: "Content structure determines citability",
              body: "AI models do not read content the way humans do. They extract chunks, evaluate information density, and assess authority signals. Content that is easy to extract, factually dense, and clearly structured is far more likely to be cited.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <h3 className="text-base font-semibold text-slate-200 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AEO vs SEO */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          AEO vs traditional SEO
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">
                    Aspect
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">
                    Traditional SEO
                  </th>
                  <th className="text-left px-5 py-3 text-teal-400 font-medium">
                    AEO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  {
                    aspect: "Goal",
                    seo: "Rank in blue links",
                    aeo: "Get cited in AI answers",
                  },
                  {
                    aspect: "Primary signal",
                    seo: "Backlinks and keyword density",
                    aeo: "Content structure and information density",
                  },
                  {
                    aspect: "Content format",
                    seo: "Keyword-optimized pages",
                    aeo: "Extractable, well-chunked content",
                  },
                  {
                    aspect: "Success metric",
                    seo: "Position and click-through rate",
                    aeo: "AI citations and source mentions",
                  },
                  {
                    aspect: "User interaction",
                    seo: "User clicks through to your site",
                    aeo: "User sees your content cited in the answer",
                  },
                  {
                    aspect: "Authority signals",
                    seo: "Domain authority, backlinks",
                    aeo: "E-E-A-T markers, cited data, credentials",
                  },
                ].map((row) => (
                  <tr key={row.aspect}>
                    <td className="px-5 py-3 text-slate-300 font-medium">
                      {row.aspect}
                    </td>
                    <td className="px-5 py-3 text-slate-400">{row.seo}</td>
                    <td className="px-5 py-3 text-slate-300">{row.aeo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What makes content AI-citable */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          What makes content AI-citable?
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            Research into how large language models select and cite sources
            points to several consistent patterns:
          </p>
          <ul className="space-y-2">
            {[
              "Lead with the answer. Content that puts the key takeaway in the first paragraph is far more likely to be extracted by AI systems.",
              "Use clear, hierarchical headings. Well-structured H2 and H3 headings help AI models identify the boundaries and topics of each content section.",
              "Include specific data. Numbers, statistics, dates, and concrete examples are preferred over vague claims. Information density matters.",
              "Keep sections self-contained. Each section should make sense on its own because AI models often extract individual chunks rather than entire articles.",
              "Position the subject clearly. Active voice with the main entity as the grammatical subject helps AI models correctly attribute claims.",
              "Add authority markers. Author credentials, methodology descriptions, source citations, and first-hand experience signals increase trust.",
              "Use domain-specific terminology. Precise, technical language signals expertise and helps AI models match your content to specialized queries.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
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
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* GEO section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          What about Generative Engine Optimization (GEO)?
        </h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-300 leading-relaxed space-y-4">
          <p>
            Generative Engine Optimization (GEO) is a closely related concept.
            While AEO is the broader practice of optimizing for all AI answer
            engines, GEO specifically focuses on optimizing for generative AI
            search experiences like Google AI Overviews, Perplexity, and
            ChatGPT.
          </p>
          <p>
            In practice, AEO and GEO overlap significantly. The same content
            principles that make your pages citable by one AI system make them
            citable by all of them. PagePulse covers both by scoring the
            fundamental content attributes that all AI engines use to evaluate
            sources.
          </p>
        </div>
      </section>

      {/* How PagePulse helps */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          How PagePulse helps with AEO
        </h2>
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-sm text-slate-300 leading-relaxed space-y-4">
          <p>
            PagePulse was built specifically to measure the content attributes
            that determine AI citability. Instead of guessing what to fix, you
            get a data-driven audit across 9 evidence-based dimensions.
          </p>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="text-teal-400 font-bold shrink-0">1.</span>
              <span>
                <strong className="text-slate-200">Audit any content</strong>{" "}
                by URL, pasted text, or .docx upload. Works for published pages
                and pre-publish drafts.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 font-bold shrink-0">2.</span>
              <span>
                <strong className="text-slate-200">
                  Get scored across 9 dimensions
                </strong>{" "}
                covering search intent alignment, information density, content
                structure, authority signals, and more.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 font-bold shrink-0">3.</span>
              <span>
                <strong className="text-slate-200">
                  Receive BEFORE/AFTER rewrites
                </strong>{" "}
                showing exactly what to change in your content and why.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 font-bold shrink-0">4.</span>
              <span>
                <strong className="text-slate-200">
                  Download shareable PDF reports
                </strong>{" "}
                for your team, clients, or stakeholders.
              </span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-block px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition"
            >
              Try PagePulse Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
