import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Guide | CiteAudit",
  description:
    "Learn how to use CiteAudit to audit your content for AI search optimization. Setup guide, scoring explained, and troubleshooting tips.",
};

const quickLinks = [
  { label: "Getting started", href: "#getting-started" },
  { label: "Audit sources", href: "#audit-sources" },
  { label: "Understanding scores", href: "#understanding-scores" },
  { label: "The 9 dimensions", href: "#dimensions" },
  { label: "Plans and limits", href: "#plans" },
  { label: "Troubleshooting", href: "#troubleshooting" },
  { label: "Contact support", href: "#contact" },
];

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-xl font-bold text-slate-100 mb-4 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

export default function HelpPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">
        Help & Guide
      </h1>
      <p className="text-slate-400 mb-8">
        Everything you need to get the most out of CiteAudit.
      </p>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2 mb-12">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-teal-400 hover:border-teal-500/40 transition"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Getting started */}
      <section className="mb-12">
        <SectionHeading id="getting-started">Getting started</SectionHeading>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            CiteAudit audits your content across 9 evidence-based dimensions to
            measure how well AI search engines can extract, understand, and cite
            it. Here is how to run your first audit:
          </p>
          <ol className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">
                1
              </span>
              <span>
                <strong className="text-slate-200">Create an account</strong> or
                sign in. You get 2 free audits every month, no credit card
                needed.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">
                2
              </span>
              <span>
                <strong className="text-slate-200">
                  Click &quot;New Audit&quot;
                </strong>{" "}
                from the dashboard. Choose your input method: paste a URL, paste
                your draft text, or upload a .docx file.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">
                3
              </span>
              <span>
                <strong className="text-slate-200">
                  Wait about 30 to 60 seconds
                </strong>{" "}
                while CiteAudit fetches (or parses) your content, scores it
                across all 9 dimensions, and generates your report.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">
                4
              </span>
              <span>
                <strong className="text-slate-200">Review your results</strong>.
                You will see your Content Quality Score (CQS), AI Citability
                rating, per-dimension breakdowns, and actionable BEFORE/AFTER
                rewrite suggestions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">
                5
              </span>
              <span>
                <strong className="text-slate-200">Download your PDF</strong>{" "}
                report to share with your team or clients. Pro plan users also
                get a fully revised article with all fixes applied.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* Audit sources */}
      <section className="mb-12">
        <SectionHeading id="audit-sources">Audit sources</SectionHeading>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-base font-semibold text-slate-200 mb-2">
              URL audit
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Paste any publicly accessible URL. CiteAudit fetches the page
              content, strips navigation, ads, and boilerplate, then analyzes
              the core article text. This is ideal for auditing published blog
              posts, landing pages, documentation, and knowledge base articles.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-base font-semibold text-slate-200 mb-2">
              Paste text or HTML
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Paste your draft content directly into the text area. This is
              perfect for auditing articles before publishing. You can paste
              plain text or HTML. Content must be at least 100 characters long.
              Optionally add a title for easy identification on your dashboard.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-base font-semibold text-slate-200 mb-2">
              Upload .docx
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload a Word document (.docx) up to 10 MB. CiteAudit extracts
              the text content including headings, paragraphs, lists, and
              tables. This works great with documents exported from Google Docs.
              To export from Google Docs, go to File &gt; Download &gt;
              Microsoft Word (.docx).
            </p>
          </div>
        </div>
      </section>

      {/* Understanding scores */}
      <section className="mb-12">
        <SectionHeading id="understanding-scores">
          Understanding your scores
        </SectionHeading>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-2">
              Content Quality Score (CQS)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              A weighted 0-100 score calculated from all 9 content dimensions.
              It measures how well-structured your content is for both
              traditional search engines and AI answer engines.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { range: "81-100", label: "Excellent", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { range: "61-80", label: "Good", color: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
                { range: "41-60", label: "Needs work", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                { range: "0-40", label: "Poor", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
              ].map((tier) => (
                <div
                  key={tier.range}
                  className={`rounded-lg border px-3 py-2 text-center ${tier.color}`}
                >
                  <div className="text-lg font-bold">{tier.range}</div>
                  <div className="text-xs mt-0.5">{tier.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-200 mb-2">
              AI Citability Score
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              A 0-10 score predicting how likely AI systems are to reference
              your content as a source. As AI-powered search engines like
              Perplexity, ChatGPT, and Google AI Overviews become primary
              discovery channels, higher citability means more visibility and
              referral traffic from these platforms. A score of 7+ is considered
              strong, 5-7 is average, and below 5 indicates significant room for
              improvement.
            </p>
          </div>
        </div>
      </section>

      {/* The 9 dimensions */}
      <section className="mb-12">
        <SectionHeading id="dimensions">The 9 dimensions explained</SectionHeading>
        <div className="space-y-3">
          {[
            {
              name: "CSI Alignment",
              weight: "High",
              description:
                "Measures how well your content matches the central search intent behind a query. Content that directly answers what the searcher is looking for scores higher. AI engines prioritize content that fully satisfies the user's information need.",
            },
            {
              name: "BLUF Quality",
              weight: "Medium-High",
              description:
                "Checks whether the bottom-line answer appears early in the content or is buried deep within the text. AI models strongly favor content that leads with the key takeaway, making it easy to extract and cite quickly.",
            },
            {
              name: "Chunk Quality",
              weight: "Medium",
              description:
                "Evaluates how self-contained and well-sized each section is for AI extraction. Well-chunked content uses clear headings, keeps sections focused on a single topic, and makes it easy for AI models to pull complete, coherent excerpts.",
            },
            {
              name: "URR Placement",
              weight: "Medium",
              description:
                "Assesses the placement of unique, rare, and remarkable attributes in your content. Original data points, proprietary insights, and distinctive perspectives positioned prominently give AI models a reason to cite your content over competitors.",
            },
            {
              name: "Cost of Retrieval",
              weight: "Medium",
              description:
                "Measures how easily AI models can extract structured information from the page. Content with clear formatting, tables, numbered lists, and consistent structure scores higher because the cost to the AI of finding and pulling information is lower.",
            },
            {
              name: "Information Density",
              weight: "Medium-High",
              description:
                "The ratio of concrete facts, data points, and specific claims to filler, fluff, and vague statements. Dense content provides more value per sentence, making it a preferred citation source for AI answer engines.",
            },
            {
              name: "SRL Salience",
              weight: "Low-Medium",
              description:
                "Evaluates whether the main entity is positioned as the subject of sentences or buried in passive constructions. Active voice with clear semantic roles helps AI models correctly attribute claims and identify the primary topic.",
            },
            {
              name: "TF-IDF Quality",
              weight: "Medium",
              description:
                "Analyzes the use of specialized, domain-specific terminology versus generic, commodity language. Content that uses precise technical terms signals deeper expertise to AI models and is more likely to be selected for specialized queries.",
            },
            {
              name: "E-E-A-T Signals",
              weight: "High",
              description:
                "Evaluates the presence of experience, expertise, authoritativeness, and trust markers. Author credentials, citations, methodology descriptions, and first-hand experience signals all increase the likelihood that AI systems treat your content as authoritative.",
            },
          ].map((dim, i) => (
            <div
              key={dim.name}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-teal-400">
                  {i + 1}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-slate-200">
                    {dim.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                    Weight: {dim.weight}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {dim.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans and limits */}
      <section className="mb-12">
        <SectionHeading id="plans">Plans and limits</SectionHeading>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">
                    Feature
                  </th>
                  <th className="text-center px-5 py-3 text-slate-400 font-medium">
                    Free
                  </th>
                  <th className="text-center px-5 py-3 text-teal-400 font-medium">
                    Starter
                  </th>
                  <th className="text-center px-5 py-3 text-slate-400 font-medium">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { feature: "Audits per month", free: "2", starter: "15", pro: "50" },
                  { feature: "URL audits", free: "Yes", starter: "Yes", pro: "Yes" },
                  { feature: "Paste text audits", free: "Yes", starter: "Yes", pro: "Yes" },
                  { feature: ".docx upload", free: "Yes", starter: "Yes", pro: "Yes" },
                  { feature: "9-dimension scoring", free: "Yes", starter: "Yes", pro: "Yes" },
                  { feature: "CQS & Citability scores", free: "Yes", starter: "Yes", pro: "Yes" },
                  { feature: "BEFORE/AFTER rewrites", free: "Basic", starter: "Detailed", pro: "Detailed" },
                  { feature: "PDF report download", free: "No", starter: "Yes", pro: "Yes" },
                  { feature: "AI-revised article", free: "No", starter: "No", pro: "Yes" },
                  { feature: "Priority support", free: "No", starter: "No", pro: "Yes" },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="px-5 py-3 text-slate-300">{row.feature}</td>
                    <td className="px-5 py-3 text-center text-slate-400">
                      {row.free}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-300">
                      {row.starter}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-300">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Audit limits reset at the start of each billing cycle. Unused audits
          do not roll over. You can upgrade or downgrade at any time from
          your{" "}
          <Link href="/account" className="text-teal-400 hover:underline">
            Account
          </Link>{" "}
          page.
        </p>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <SectionHeading id="troubleshooting">Troubleshooting</SectionHeading>
        <div className="space-y-4">
          {[
            {
              q: "My audit is stuck on 'pending' or 'fetching'",
              a: "Audits typically complete within 60 seconds. If your audit has been pending for more than 2 minutes, try refreshing the page. If the issue persists, the target URL may be blocking automated access. Try the paste text method instead.",
            },
            {
              q: "The audit failed with an error",
              a: "Audit failures can happen if the target URL requires authentication, blocks bots, or returns an error page. Make sure the URL is publicly accessible. For pages behind a login, use the paste text or .docx upload method instead.",
            },
            {
              q: "My .docx upload is not working",
              a: "Ensure the file is a valid .docx file (not .doc or .pdf) and is under 10 MB. Files with heavy formatting, embedded images, or macros may not parse correctly. Try exporting as a fresh .docx from Google Docs or Word.",
            },
            {
              q: "I reached my audit limit",
              a: "Free accounts get 2 audits per month. Starter gets 15 and Pro gets 50. Your limit resets at the start of each billing cycle. Upgrade from the Pricing page to increase your monthly quota.",
            },
            {
              q: "My PDF report looks incomplete",
              a: "PDF reports are generated in your browser. Make sure pop-ups are not blocked. If the download does not start, try using Chrome or Edge. The revised article section in the PDF is only available on the Pro plan.",
            },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <h3 className="text-sm font-semibold text-slate-200 mb-2">
                {item.q}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact support */}
      <section className="mb-4">
        <SectionHeading id="contact">Contact support</SectionHeading>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Can not find what you are looking for? Our support team is here to
            help.
          </p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-teal-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                />
              </svg>
              <span>
                <strong className="text-slate-200">Submit a ticket</strong> from
                the{" "}
                <Link
                  href="/support"
                  className="text-teal-400 hover:underline"
                >
                  Support page
                </Link>{" "}
                in your dashboard (requires sign-in).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-teal-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span>
                <strong className="text-slate-200">Email us</strong> at{" "}
                <a
                  href="mailto:support@doodigital.co"
                  className="text-teal-400 hover:underline"
                >
                  support@doodigital.co
                </a>
              </span>
            </li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">
            We typically respond within 24 hours on business days.
          </p>
        </div>
      </section>
    </div>
  );
}
