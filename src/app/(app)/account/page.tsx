import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    free: "bg-slate-700 text-slate-300",
    starter: "bg-indigo-500/20 text-indigo-400",
    pro: "bg-amber-500/20 text-amber-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        colors[plan] || colors.free
      }`}
    >
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) redirect("/login");

  const sub = user.subscription;
  const plan = sub?.plan || "free";
  const used = sub?.auditsUsed || 0;
  const limit = sub?.auditsLimit || 2;
  const isUnlimited = limit === -1;
  const usagePercent = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Account Settings</h1>
      <p className="text-sm text-slate-400 mb-8">
        Manage your profile, subscription, and account preferences.
      </p>

      <div className="space-y-6">
        {/* ── Profile ── */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Profile</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Name
              </label>
              <input
                type="text"
                defaultValue={user.name || ""}
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full rounded-lg border border-slate-700 bg-slate-800/30 px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">
                Email cannot be changed. It is linked to your login provider.
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-400 mb-1">
                Member since
              </div>
              <div className="text-sm text-slate-300">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-indigo-600/50 text-white/60 text-sm font-medium cursor-not-allowed"
                title="Coming soon"
              >
                Save Changes
              </button>
              <span className="ml-3 text-xs text-slate-500">Coming soon</span>
            </div>
          </div>
        </div>

        {/* ── Subscription ── */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Subscription</h2>
            <PlanBadge plan={plan} />
          </div>

          <div className="space-y-5">
            {/* Audit usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">
                  Audits used this month
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {isUnlimited ? `${used} (Unlimited)` : `${used} / ${limit}`}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    usagePercent >= 100
                      ? "bg-rose-500"
                      : usagePercent >= 80
                        ? "bg-amber-500"
                        : "bg-indigo-500"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              {usagePercent >= 100 && (
                <p className="mt-2 text-xs text-rose-400">
                  You have reached your monthly audit limit.
                </p>
              )}
            </div>

            {/* Billing period */}
            {sub?.currentPeriodEnd && plan !== "free" && (
              <div>
                <div className="text-sm font-medium text-slate-400 mb-1">
                  Billing period ends
                </div>
                <div className="text-sm text-slate-300">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
              >
                Manage Subscription
              </Link>
            </div>

            {/* Free plan upsell */}
            {plan === "free" && (
              <div className="mt-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-indigo-300">
                      Upgrade to unlock more audits
                    </p>
                    <p className="text-xs text-indigo-400/70 mt-1">
                      Get up to 100 audits per month, priority processing, and advanced
                      analytics with a paid plan.
                    </p>
                    <Link
                      href="/pricing"
                      className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
                    >
                      View Plans
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="rounded-xl border border-rose-500/30 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-rose-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-400 mb-4">
            This will permanently delete your account and all audit data. This action
            cannot be undone.
          </p>
          <button
            disabled
            className="px-4 py-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-sm font-medium cursor-not-allowed opacity-60 transition"
            title="Coming soon"
          >
            Delete Account
          </button>
          <span className="ml-3 text-xs text-slate-500">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
