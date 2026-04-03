import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

function statusColor(status: string) {
  switch (status) {
    case "completed": return "text-emerald-400 bg-emerald-500/10";
    case "failed": return "text-rose-400 bg-rose-500/10";
    case "pending": return "text-slate-400 bg-slate-500/10";
    default: return "text-amber-400 bg-amber-500/10";
  }
}

function scoreColor(score: number | null) {
  if (score === null) return "text-slate-500";
  if (score >= 81) return "text-emerald-400";
  if (score >= 61) return "text-amber-300";
  if (score >= 41) return "text-amber-500";
  return "text-rose-400";
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [audits, subscription] = await Promise.all([
    db.audit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.subscription.findUnique({
      where: { userId },
    }),
  ]);

  const plan = subscription?.plan || "free";
  const used = subscription?.auditsUsed || 0;
  const limit = subscription?.auditsLimit || 2;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} plan · {used}/{limit} audits used this month
          </p>
        </div>
        <Link
          href="/audit/new"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
        >
          New Audit
        </Link>
      </div>

      {audits.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <div className="text-slate-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No audits yet</h3>
          <p className="text-sm text-slate-500 mb-6">Run your first content audit to get started.</p>
          <Link
            href="/audit/new"
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition"
          >
            Run first audit
          </Link>

          {/* Getting started guide */}
          <div className="mt-10 pt-8 border-t border-slate-800 text-left max-w-md mx-auto">
            <h4 className="text-sm font-semibold text-slate-300 mb-4 text-center">Getting started</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                <p className="text-sm text-slate-400">Paste a URL, draft text, or upload a .docx file</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                <p className="text-sm text-slate-400">PagePulse scores your content across 9 AI-readiness dimensions</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                <p className="text-sm text-slate-400">Get actionable BEFORE/AFTER rewrites and a downloadable PDF report</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link href="/help" className="text-xs text-teal-400 hover:underline">Help & Guide</Link>
              <span className="text-slate-700">|</span>
              <Link href="/what-is-aeo" className="text-xs text-teal-400 hover:underline">What is AEO?</Link>
              <span className="text-slate-700">|</span>
              <Link href="/how-it-works" className="text-xs text-teal-400 hover:underline">How It Works</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-900/50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Content</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">CQS</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Citability</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-900/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/audit/${audit.id}`}
                        className="text-sm text-indigo-400 hover:text-indigo-300 truncate block max-w-xs"
                      >
                        {audit.title || audit.url}
                      </Link>
                      {audit.sourceType && audit.sourceType !== "url" && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                            audit.sourceType === "paste"
                              ? "bg-violet-500/15 text-violet-400"
                              : "bg-blue-500/15 text-blue-400"
                          }`}
                        >
                          {audit.sourceType === "paste" ? "Draft" : ".docx"}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">
                      {audit.sourceType === "paste"
                        ? "Pasted draft"
                        : audit.sourceType === "docx"
                        ? audit.url.replace("upload://", "")
                        : audit.url}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${scoreColor(audit.cqs)}`}>
                      {audit.cqs !== null ? Math.round(audit.cqs) : "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${scoreColor(audit.citability ? audit.citability * 10 : null)}`}>
                      {audit.citability !== null ? audit.citability.toFixed(1) : "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(audit.status)}`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {new Date(audit.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
