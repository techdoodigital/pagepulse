import React from "react";
import { cn } from "@/lib/cn";

type AuditStatus =
  | "pending"
  | "fetching"
  | "scoring"
  | "generating"
  | "completed"
  | "failed";

interface BadgeProps {
  status: AuditStatus;
  className?: string;
}

const statusConfig: Record<
  AuditStatus,
  { label: string; classes: string; dotColor: string }
> = {
  pending: {
    label: "Pending",
    classes: "bg-slate-700/50 text-slate-300 border-slate-600",
    dotColor: "bg-slate-400",
  },
  fetching: {
    label: "Fetching",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    dotColor: "bg-blue-400 animate-pulse",
  },
  scoring: {
    label: "Scoring",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dotColor: "bg-amber-400 animate-pulse",
  },
  generating: {
    label: "Generating",
    classes: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    dotColor: "bg-violet-400 animate-pulse",
  },
  completed: {
    label: "Completed",
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dotColor: "bg-emerald-400",
  },
  failed: {
    label: "Failed",
    classes: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dotColor: "bg-rose-400",
  },
};

export function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}
