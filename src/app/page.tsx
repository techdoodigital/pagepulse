"use client";

import Link from "next/link";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const benefits = [
  {
    title: "Optimize content for AI search engines",
    description:
      "PagePulse analyzes your content the way AI search engines do. Know exactly what to change so ChatGPT, Perplexity, and Google AI Overviews reference your pages as a source.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Replace guesswork with data",
    description:
      "Each audit delivers prioritized recommendations ranked by impact. No more wondering which fixes matter most for your content's AI discoverability.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Audit any URL in under 60 seconds",
    description:
      "Paste a URL and receive a full content audit with scores, analysis, and concrete rewrites. No setup, no integrations, no waiting.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Share data-driven content reports",
    description:
      "Generate clear reports showing how content performs across 9 evidence-based dimensions. Ideal for agencies, content teams, and client presentations.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Get copy-ready BEFORE/AFTER rewrites",
    description:
      "Every recommendation includes specific rewrite examples pulled directly from your content. Copy, paste, and publish improved content immediately.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: "Learn what makes content AI-citable",
    description:
      "Understand how structure, information density, authority signals, and semantic roles determine whether AI systems choose your content over a competitor's.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const dimensions = [
  { name: "CSI Alignment", description: "How well content matches the central search intent behind a query" },
  { name: "BLUF Quality", description: "Whether the bottom-line answer appears early or is buried in the content" },
  { name: "Chunk Quality", description: "How self-contained and well-sized each section is for AI extraction" },
  { name: "URR Placement", description: "Placement of unique, rare, and remarkable attributes in the content" },
  { name: "Cost of Retrieval", description: "How easily AI models can extract structured information from the page" },
  { name: "Information Density", description: "The ratio of concrete facts to filler, fluff, and vague claims" },
  { name: "SRL Salience", description: "Whether the main entity is positioned as the subject or buried in passive voice" },
  { name: "TF-IDF Quality", description: "Use of specialized terminology versus generic, commodity language" },
  { name: "E-E-A-T Signals", description: "Presence of experience, expertise, authoritativeness, and trust markers" },
];

const steps = [
  {
    number: 1,
    title: "Paste your URL",
    description:
      "Enter any blog post, article, or landing page URL. Any publicly accessible page works.",
  },
  {
    number: 2,
    title: "AI analyzes your content",
    description:
      "Your content is scored across 9 evidence-based dimensions in under 60 seconds.",
  },
  {
    number: 3,
    title: "Get actionable fixes",
    description:
      "Receive a detailed report with scores, BEFORE/AFTER rewrites, and prioritized action items.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    audits: "2 audits/month",
    features: [
      "Content-only analysis",
      "9-dimension scoring",
      "Content Quality Score",
      "AI Citability Score",
      "Basic recommendations",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    audits: "15 audits/month",
    features: [
      "Everything in Free",
      "Detailed BEFORE/AFTER rewrites",
      "E-E-A-T enhancement blocks",
      "Priority recommendations",
      "Downloadable PDF reports",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    audits: "50 audits/month",
    features: [
      "Everything in Starter",
      "AI-revised article with fixes applied",
      "Downloadable PDF reports",
      "Bulk audit support",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "What is a Content Quality Score (CQS)?",
    answer:
      "A Content Quality Score is a weighted 0-100 metric calculated from 9 content dimensions: CSI Alignment, BLUF Quality, Chunk Quality, URR Placement, Cost of Retrieval, Information Density, SRL Salience, TF-IDF Quality, and E-E-A-T signals. It measures how well-structured your content is for both traditional search engines and AI answer engines like ChatGPT, Perplexity, and Google AI Overviews.",
  },
  {
    question: "What is AI Citability and why does it matter?",
    answer:
      "AI Citability is a 0-10 score that predicts how likely AI systems are to reference your content as a source in their responses. As AI-powered search engines like Perplexity, ChatGPT with browsing, and Google AI Overviews become primary ways people find information, content that scores higher on citability receives more visibility and referral traffic from these platforms.",
  },
  {
    question: "What is Answer Engine Optimization (AEO)?",
    answer:
      "Answer Engine Optimization is the practice of structuring content so AI-powered answer engines can easily extract, understand, and cite it. Unlike traditional SEO which focuses on ranking in blue links, AEO focuses on making content the preferred source for AI-generated answers. PagePulse audits your content across the exact dimensions that determine whether AI systems select your content or a competitor's.",
  },
  {
    question: "What is Generative Engine Optimization (GEO)?",
    answer:
      "Generative Engine Optimization refers to optimizing content specifically for large language model-powered search experiences. This includes Google AI Overviews, Perplexity, ChatGPT search, and Microsoft Copilot. GEO involves improving information density, adding authority signals, using structured formatting, and ensuring your content's key claims are easy for AI models to extract and attribute.",
  },
  {
    question: "What types of content can PagePulse audit?",
    answer:
      "PagePulse can audit any publicly accessible webpage including blog posts, articles, landing pages, product pages, documentation, and knowledge base articles. The page must be reachable without login. We extract clean content from the URL automatically, removing navigation, ads, and boilerplate before analysis.",
  },
  {
    question: "How does PagePulse differ from traditional SEO tools?",
    answer:
      "Traditional SEO tools focus on keywords, backlinks, and search engine ranking factors. PagePulse focuses on content structure and quality from the perspective of AI answer engines. We score dimensions like Information Density (fact-to-filler ratio), BLUF Quality (whether the answer appears early), and SRL Salience (semantic role positioning) that directly affect whether AI systems cite your content.",
  },
  {
    question: "How long does a content audit take?",
    answer:
      "Most audits complete in 30 to 60 seconds. PagePulse fetches your content, analyzes it across all 9 dimensions, calculates your Content Quality Score and AI Citability rating, then generates a detailed report with specific BEFORE/AFTER rewrite recommendations.",
  },
  {
    question: "What are the 9 content dimensions PagePulse measures?",
    answer:
      "PagePulse scores content across: (1) CSI Alignment, which measures search intent match, (2) BLUF Quality, which checks if the answer appears early, (3) Chunk Quality for section autonomy, (4) URR Placement for unique attributes, (5) Cost of Retrieval for structure and formatting, (6) Information Density for fact-to-filler ratio, (7) SRL Salience for entity positioning, (8) TF-IDF Quality for terminology specificity, and (9) E-E-A-T for experience, expertise, authority, and trust signals.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your PagePulse subscription at any time from your Account page. You will keep access to all features until the end of your current billing period. All your existing audit reports remain accessible after cancellation.",
  },
  {
    question: "Does PagePulse store my content?",
    answer:
      "PagePulse stores the extracted content and audit results so you can access your reports from the dashboard at any time. Your content is never shared with third parties or used to train AI models. You can delete any audit and its associated data from your dashboard.",
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-900/50 transition"
      >
        <span className="text-sm font-medium text-slate-200">{question}</span>
        <svg
          className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm text-slate-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar (sticky) */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
          >
            CiteAudit
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-sm text-slate-400 hover:text-slate-200 transition">
              Benefits
            </a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-200 transition">
              How it works
            </a>
            <a href="#dimensions" className="text-sm text-slate-400 hover:text-slate-200 transition">
              Dimensions
            </a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-slate-200 transition">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-slate-400 hover:text-slate-200 transition">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition font-medium"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              AI Content Audit Tool
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-6">
              Is your content
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                AI-citeable?
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
              CiteAudit audits any URL against 9 evidence-based dimensions and tells
              you exactly what to fix so AI search engines like ChatGPT, Perplexity,
              and Google AI Overviews cite your content as a source.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold transition text-sm"
              >
                Audit Your Content Free
              </Link>
              <a
                href="#how-it-works"
                className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-200 transition text-sm"
              >
                See how it works
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              No credit card required. 2 free audits every month.
            </p>
          </div>

          {/* Right: product preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-xs text-slate-500 ml-2">citeaudit.co/audit/results</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Content Quality Score</div>
                  <div className="text-4xl font-bold text-amber-400">72</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">AI Citability</div>
                  <div className="text-4xl font-bold text-emerald-400">7.4</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Fixes Found</div>
                  <div className="text-4xl font-bold text-teal-400">12</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "CSI Alignment", score: 8, color: "bg-emerald-400" },
                  { label: "E-E-A-T", score: 6, color: "bg-amber-400" },
                  { label: "Information Density", score: 7, color: "bg-teal-400" },
                  { label: "Cost of Retrieval", score: 9, color: "bg-emerald-400" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-36 shrink-0">{d.label}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${d.color}`}
                        style={{ width: `${d.score * 10}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-300 w-6 text-right">
                      {d.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-6">
            Built for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Content Teams", "SEO Agencies", "SaaS Marketers", "E-commerce Brands", "Media Publishers", "Freelance Writers"].map(
              (name) => (
                <span key={name} className="text-sm font-medium text-slate-600">
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Benefits (bento grid) */}
      <section id="benefits" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
            Why use PagePulse for AI search optimization?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Traditional SEO tools measure keywords and backlinks. PagePulse measures
            the content signals that AI answer engines actually use to decide what to cite.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition">
                {b.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">
                {b.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
            How to audit your content for AI search
          </h2>
          <p className="text-slate-400">
            Three steps to AI-optimized content
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-teal-500/40 to-transparent" />
              )}
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center mx-auto mb-5 relative z-10">
                <span className="text-lg font-bold text-slate-950">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9 Dimensions */}
      <section id="dimensions" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
            The 9 dimensions of AI-citable content
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            CiteAudit scores every page across 9 research-backed dimensions that
            determine how AI search engines evaluate, extract, and cite content.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((d, i) => (
            <div
              key={d.name}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex gap-4 items-start"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-teal-400">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">{d.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{d.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400">
            Start free. Upgrade when you need more audits.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 relative ${
                plan.highlighted
                  ? "border-teal-500 bg-teal-500/5 ring-1 ring-teal-500/20"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-100 mt-1">
                {plan.name}
              </h3>
              <div className="mt-3 mb-1">
                <span className="text-4xl font-bold text-slate-100">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-400 ml-1">{plan.period}</span>
              </div>
              <div className="text-sm text-slate-400 mb-6">{plan.audits}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <svg
                      className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
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
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white"
                    : "border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-400">
            Everything you need to know about PagePulse and AI content optimization
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to make your content AI-ready?
          </h2>
          <p className="text-teal-100 mb-8 text-lg max-w-xl mx-auto">
            Start with 2 free audits. No credit card required. See exactly
            what to fix so AI search engines cite your content.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 rounded-lg bg-white text-teal-700 font-semibold hover:bg-teal-50 transition text-sm"
          >
            Audit Your First Page Free &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
              >
                CiteAudit
              </Link>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                AI-powered content auditing for the age of answer engines.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#benefits" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    Benefits
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#dimensions" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    9 Dimensions
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/what-is-aeo" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    What is AEO?
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    Help & Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300 transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Stay updated</h4>
              <p className="text-xs text-slate-500 mb-3">
                Get tips on optimizing content for AI search engines.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail("");
                }}
                className="flex"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 min-w-0 text-sm px-3 py-2 rounded-l-lg bg-slate-900 border border-slate-700 border-r-0 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-r-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              &copy; 2026 PagePulse. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300 transition">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300 transition">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
