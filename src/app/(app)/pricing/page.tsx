"use client";

import { useState, useEffect } from "react";

interface SubscriptionInfo {
  plan: string;
  status: string;
  stripeCustomerId: string | null;
  auditsUsed: number;
  auditsLimit: number;
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    audits: "2 audits/month",
    features: ["Content-only analysis", "9-dimension scoring", "Basic report"],
    highlighted: false,
  },
  {
    id: "starter",
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
    highlighted: true,
  },
  {
    id: "pro",
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
    highlighted: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [stripeConfigured, setStripeConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.subscription) {
          setSubscription(data.subscription);
        }
        if (data?.stripeConfigured !== undefined) {
          setStripeConfigured(data.stripeConfigured);
        }
      })
      .catch(() => {
        // Silently fail - user will see default state
      });
  }, []);

  const currentPlan = subscription?.plan || "free";
  const hasPaidPlan = currentPlan === "starter" || currentPlan === "pro";

  async function handleSubscribe(planId: string) {
    if (planId === "free" || planId === currentPlan) return;
    setLoading(planId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session. Please configure Stripe.");
      }
    } catch {
      alert("Failed to create checkout session");
    } finally {
      setLoading(null);
    }
  }

  async function handleManageSubscription() {
    setLoading("manage");

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open billing portal.");
      }
    } catch {
      alert("Failed to open billing portal");
    } finally {
      setLoading(null);
    }
  }

  function getButtonLabel(planId: string): string {
    if (!stripeConfigured && planId !== "free") return "Coming soon";
    if (planId === "free") {
      return currentPlan === "free" ? "Current plan" : "Free tier";
    }
    if (planId === currentPlan) return "Current plan";
    if (hasPaidPlan) return "Manage Subscription";
    return `Upgrade to ${planId === "starter" ? "Starter" : "Pro"}`;
  }

  function isButtonDisabled(planId: string): boolean {
    if (!stripeConfigured && planId !== "free") return true;
    if (planId === "free") return true;
    if (planId === currentPlan) return true;
    if (loading !== null) return true;
    return false;
  }

  function handleButtonClick(planId: string) {
    if (planId === "free" || planId === currentPlan) return;
    if (hasPaidPlan) {
      handleManageSubscription();
    } else {
      handleSubscribe(planId);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Upgrade your plan</h1>
        <p className="text-sm text-slate-400">
          Get more audits and unlock advanced features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-6 relative ${
              plan.highlighted
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-slate-800 bg-slate-900/50"
            }`}
          >
            {plan.highlighted && (
              <div className="text-xs font-medium text-indigo-400 mb-3">
                Most popular
              </div>
            )}
            {plan.id === currentPlan && (
              <div className="absolute top-4 right-4 text-xs font-medium bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Current
              </div>
            )}
            <h3 className="text-lg font-semibold text-slate-100">{plan.name}</h3>
            <div className="mt-2 mb-1">
              <span className="text-3xl font-bold text-slate-100">{plan.price}</span>
              <span className="text-sm text-slate-400">{plan.period}</span>
            </div>
            <div className="text-sm text-slate-400 mb-6">{plan.audits}</div>
            <ul className="space-y-2 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleButtonClick(plan.id)}
              disabled={isButtonDisabled(plan.id)}
              className={`w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                plan.id === "free" || plan.id === currentPlan
                  ? "border border-slate-700 text-slate-500 cursor-default"
                  : !stripeConfigured
                  ? "border border-slate-700 text-slate-500 cursor-not-allowed opacity-50"
                  : plan.highlighted
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                  : "border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-200 disabled:opacity-50"
              }`}
            >
              {loading === plan.id || (loading === "manage" && hasPaidPlan && plan.id !== "free" && plan.id !== currentPlan)
                ? "Loading..."
                : getButtonLabel(plan.id)}
            </button>
          </div>
        ))}
      </div>

      {hasPaidPlan && (
        <div className="mt-8 text-center">
          <button
            onClick={handleManageSubscription}
            disabled={loading === "manage"}
            className="text-sm text-slate-400 hover:text-slate-200 underline underline-offset-4 transition"
          >
            {loading === "manage" ? "Loading..." : "Manage Subscription & Billing"}
          </button>
        </div>
      )}
    </div>
  );
}
