"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";

interface ScoreCardProps {
  name: string;
  score: number;
  summary: string;
  issues: string[];
  className?: string;
}

function getScoreStyles(score: number): {
  bar: string;
  text: string;
  bg: string;
} {
  if (score <= 3) {
    return { bar: "bg-rose-500", text: "text-rose-400", bg: "bg-rose-500/10" };
  }
  if (score <= 5) {
    return { bar: "bg-amber-500", text: "text-amber-400", bg: "bg-amber-500/10" };
  }
  if (score <= 7) {
    return { bar: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10" };
  }
  return { bar: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10" };
}

export function ScoreCard({
  name,
  score,
  summary,
  issues,
  className,
}: ScoreCardProps) {
  const [expanded, setExpanded] = useState(false);
  const clampedScore = Math.max(0, Math.min(10, score));
  const styles = getScoreStyles(clampedScore);

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700/50 bg-slate-800/80 p-5 transition-all duration-200",
        className
      )}
    >
      {/* Header with name and score */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-200">{name}</h4>
        <div
          className={cn(
            "flex items-center justify-center rounded-lg px-2.5 py-1 text-sm font-bold",
            styles.bg,
            styles.text
          )}
        >
          {clampedScore}/10
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3 h-1.5 w-full rounded-full bg-slate-700/50 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", styles.bar)}
          style={{ width: `${(clampedScore / 10) * 100}%` }}
        />
      </div>

      {/* Summary */}
      <p className="text-sm text-slate-400 leading-relaxed">{summary}</p>

      {/* Issues (expandable) */}
      {issues.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                expanded && "rotate-90"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            {issues.length} issue{issues.length !== 1 ? "s" : ""} found
          </button>
          {expanded && (
            <ul className="mt-2 space-y-1.5 pl-5">
              {issues.map((issue, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-400 list-disc marker:text-slate-600"
                >
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
