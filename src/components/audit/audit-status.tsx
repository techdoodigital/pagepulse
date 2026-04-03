"use client";

import React from "react";
import { cn } from "@/lib/cn";

type AuditStep = "fetching" | "scoring" | "generating" | "completed";

interface AuditStatusProps {
  status: string;
  error?: string;
  className?: string;
}

const steps: { key: AuditStep; label: string }[] = [
  { key: "fetching", label: "Fetching Content" },
  { key: "scoring", label: "Scoring Quality" },
  { key: "generating", label: "Generating Report" },
  { key: "completed", label: "Complete" },
];

function getStepIndex(status: string): number {
  const index = steps.findIndex((s) => s.key === status);
  return index === -1 ? -1 : index;
}

export function AuditStatus({ status, error, className }: AuditStatusProps) {
  const currentIndex = getStepIndex(status);
  const isFailed = status === "failed";

  return (
    <div className={cn("w-full", className)}>
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isActive = i === currentIndex;
          const isCompleted = currentIndex > i || status === "completed";
          const isCurrent = isActive && !isFailed;

          return (
            <React.Fragment key={step.key}>
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                      : isCurrent
                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-400 ring-4 ring-indigo-500/20"
                        : isFailed && isActive
                          ? "border-rose-500 bg-rose-500/20 text-rose-400"
                          : "border-slate-700 bg-slate-800 text-slate-500"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isFailed && isActive ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isCompleted
                      ? "text-emerald-400"
                      : isCurrent
                        ? "text-indigo-400"
                        : isFailed && isActive
                          ? "text-rose-400"
                          : "text-slate-500"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 px-3 -mt-6">
                  <div
                    className={cn(
                      "h-0.5 w-full rounded-full transition-all duration-300",
                      currentIndex > i
                        ? "bg-emerald-500"
                        : isCurrent && i === currentIndex
                          ? "bg-gradient-to-r from-indigo-500 to-slate-700"
                          : "bg-slate-700"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active state indicator */}
      {!isFailed && status !== "completed" && status !== "pending" && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm text-slate-400">
            {status === "fetching" && "Fetching and parsing page content..."}
            {status === "scoring" && "Analyzing content quality dimensions..."}
            {status === "generating" && "Generating detailed audit report..."}
          </span>
        </div>
      )}

      {/* Error message */}
      {isFailed && error && (
        <div className="mt-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        </div>
      )}

      {/* Completed message */}
      {status === "completed" && (
        <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-emerald-300">
              Audit completed successfully. Your report is ready.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
