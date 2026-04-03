"use client";

import { useState, useEffect, useCallback } from "react";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  response: string | null;
  createdAt: string;
}

const CATEGORIES = [
  { value: "bug", label: "Bug Report" },
  { value: "feature_request", label: "Feature Request" },
  { value: "billing", label: "Billing" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-amber-500/20 text-amber-400",
    resolved: "bg-green-500/20 text-green-400",
    closed: "bg-slate-600/30 text-slate-400",
  };

  const labels: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        styles[status] || styles.open
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: "bg-slate-600/30 text-slate-400",
    medium: "bg-amber-500/20 text-amber-400",
    high: "bg-rose-500/20 text-rose-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        styles[priority] || styles.medium
      }`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function CategoryLabel({ category }: { category: string }) {
  const cat = CATEGORIES.find((c) => c.value === category);
  return <span className="text-sm text-slate-300">{cat?.label || category}</span>;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("bug");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (description.trim().length < 20) {
      setError("Description must be at least 20 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, category, priority }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setSubject("");
      setCategory("bug");
      setPriority("medium");
      setDescription("");
      fetchTickets();
    } catch {
      setError("Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Support</h1>
      <p className="text-sm text-slate-400 mb-8">
        Need help? Submit a ticket and we&apos;ll get back to you.
      </p>

      {/* Submit a ticket form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-6">
          Submit a Ticket
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-slate-400 mb-1.5"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your issue"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition"
            />
          </div>

          {/* Category and Priority - side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-400 mb-1.5"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-slate-400 mb-1.5"
              >
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-400 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe your issue in detail (minimum 20 characters)"
              required
              minLength={20}
              rows={5}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition resize-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              {description.length}/20 characters minimum
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
              <p className="text-sm text-green-400">
                Your ticket has been submitted successfully. We will review it and
                get back to you soon.
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:bg-teal-600/50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>

      {/* Your tickets */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-6">
          Your Tickets
        </h2>

        {loading ? (
          <p className="text-sm text-slate-400">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">No tickets yet.</p>
            <p className="text-xs text-slate-600 mt-1">
              Submit a ticket above if you need help.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-lg border border-slate-800 bg-slate-800/30 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="text-sm font-medium text-slate-200">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <CategoryLabel category={ticket.category} />
                  <span>
                    {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {ticket.response && (
                  <div className="mt-3 rounded-lg border border-teal-500/20 bg-teal-500/5 px-3 py-2">
                    <p className="text-xs font-medium text-teal-400 mb-1">
                      Admin Response
                    </p>
                    <p className="text-sm text-slate-300">{ticket.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
