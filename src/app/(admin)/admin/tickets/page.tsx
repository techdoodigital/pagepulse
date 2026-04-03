"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, ChevronDown, ChevronUp, Send } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  response: string | null;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = ["all", "open", "in_progress", "resolved", "closed"];
const statusLabels: Record<string, string> = {
  all: "All",
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(() => {
    setLoading(true);
    const params = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/admin/tickets${params}`)
      .then((r) => r.json())
      .then((d) => setTickets(d.tickets))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  function toggleExpand(ticket: Ticket) {
    if (expandedId === ticket.id) {
      setExpandedId(null);
    } else {
      setExpandedId(ticket.id);
      setResponseText(ticket.response || "");
      setResponseStatus(ticket.status);
    }
  }

  async function handleRespond(ticketId: string) {
    setSubmitting(true);
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId,
        status: responseStatus,
        response: responseText,
      }),
    });
    setSubmitting(false);
    setExpandedId(null);
    fetchTickets();
  }

  const priorityColors: Record<string, string> = {
    high: "bg-red-500/10 text-red-400",
    medium: "bg-yellow-500/10 text-yellow-400",
    low: "bg-green-500/10 text-green-400",
  };

  const statusColors: Record<string, string> = {
    open: "bg-blue-500/10 text-blue-400",
    in_progress: "bg-yellow-500/10 text-yellow-400",
    resolved: "bg-emerald-500/10 text-emerald-400",
    closed: "bg-slate-800 text-slate-400",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100 mb-6">
        Ticket Management
      </h2>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              filter === s
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800/50"
            }`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-center py-10 text-slate-500">No tickets found</p>
        ) : (
          <div>
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_100px_100px_100px_100px] gap-2 px-4 py-3 border-b border-slate-800 text-slate-400 text-sm font-medium">
              <span>Subject</span>
              <span>User</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {tickets.map((ticket, i) => (
              <div key={ticket.id}>
                {/* Row */}
                <button
                  onClick={() => toggleExpand(ticket)}
                  className={`w-full text-left grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_100px_100px_100px] gap-2 px-4 py-3 border-b border-slate-800 hover:bg-slate-800/30 transition ${
                    i % 2 === 1 ? "bg-slate-800/50" : ""
                  }`}
                >
                  <span className="text-sm text-slate-200 truncate flex items-center gap-2">
                    {expandedId === ticket.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    {ticket.subject}
                  </span>
                  <span className="text-sm text-slate-400 truncate">
                    {ticket.userName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {ticket.category.replace("_", " ")}
                  </span>
                  <span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[ticket.priority] || ""}`}
                    >
                      {ticket.priority}
                    </span>
                  </span>
                  <span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ticket.status] || ""}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </button>

                {/* Expanded detail */}
                {expandedId === ticket.id && (
                  <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-1">
                        Description
                      </h4>
                      <p className="text-sm text-slate-400 whitespace-pre-wrap">
                        {ticket.description}
                      </p>
                    </div>

                    {/* Response form */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-300">
                        Admin Response
                      </h4>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response..."
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 resize-none"
                      />
                      <div className="flex items-center gap-3">
                        <select
                          value={responseStatus}
                          onChange={(e) => setResponseStatus(e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => handleRespond(ticket.id)}
                          disabled={submitting}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition disabled:opacity-50"
                        >
                          {submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Submit
                        </button>
                      </div>
                    </div>
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
