"use client";

import { useEffect, useState } from "react";
import { Users, FileText, TrendingUp, CreditCard, Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalAudits: number;
  auditsThisMonth: number;
  activeProSubs: number;
  recentAudits: {
    id: string;
    url: string;
    title: string | null;
    status: string;
    cqs: number | null;
    userName: string;
    createdAt: string;
  }[];
  recentTickets: {
    id: string;
    subject: string;
    priority: string;
    category: string;
    userName: string;
    createdAt: string;
  }[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-teal-400",
    },
    {
      label: "Total Audits",
      value: stats.totalAudits,
      icon: FileText,
      color: "text-cyan-400",
    },
    {
      label: "Audits This Month",
      value: stats.auditsThisMonth,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Pro Subscribers",
      value: stats.activeProSubs,
      icon: CreditCard,
      color: "text-violet-400",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-3xl font-bold text-slate-100">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audits */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            Recent Audits
          </h3>
          {stats.recentAudits.length === 0 ? (
            <p className="text-sm text-slate-500">No audits yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200 truncate">
                      {audit.title || audit.url || "Untitled audit"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {audit.userName} -{" "}
                      {new Date(audit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    {audit.cqs != null && (
                      <span className="text-xs font-medium text-teal-400">
                        CQS: {audit.cqs.toFixed(0)}
                      </span>
                    )}
                    <StatusBadge status={audit.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Open Tickets */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            Open Tickets
          </h3>
          {stats.recentTickets.length === 0 ? (
            <p className="text-sm text-slate-500">No open tickets</p>
          ) : (
            <div className="space-y-3">
              {stats.recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200 truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-slate-500">
                      {ticket.userName} -{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-yellow-500/10 text-yellow-400",
    failed: "bg-red-500/10 text-red-400",
    scoring: "bg-blue-500/10 text-blue-400",
    generating: "bg-blue-500/10 text-blue-400",
    fetching: "bg-blue-500/10 text-blue-400",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${colors[status] || "bg-slate-800 text-slate-400"}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-500/10 text-red-400",
    medium: "bg-yellow-500/10 text-yellow-400",
    low: "bg-green-500/10 text-green-400",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${colors[priority] || "bg-slate-800 text-slate-400"}`}
    >
      {priority}
    </span>
  );
}
