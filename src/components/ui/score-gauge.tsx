"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

function getScoreColor(score: number): {
  stroke: string;
  text: string;
  glow: string;
} {
  if (score <= 40) {
    return {
      stroke: "#f43f5e",
      text: "text-rose-400",
      glow: "drop-shadow(0 0 6px rgba(244, 63, 94, 0.4))",
    };
  }
  if (score <= 60) {
    return {
      stroke: "#f59e0b",
      text: "text-amber-400",
      glow: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))",
    };
  }
  if (score <= 80) {
    return {
      stroke: "#eab308",
      text: "text-yellow-400",
      glow: "drop-shadow(0 0 6px rgba(234, 179, 8, 0.4))",
    };
  }
  return {
    stroke: "#10b981",
    text: "text-emerald-400",
    glow: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))",
  };
}

const sizeConfig = {
  sm: { svgSize: 80, strokeWidth: 6, fontSize: "text-lg", labelSize: "text-[10px]" },
  md: { svgSize: 120, strokeWidth: 8, fontSize: "text-2xl", labelSize: "text-xs" },
  lg: { svgSize: 160, strokeWidth: 10, fontSize: "text-4xl", labelSize: "text-sm" },
};

export function ScoreGauge({
  score,
  size = "md",
  className,
  label,
}: ScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const color = getScoreColor(clampedScore);
  const config = sizeConfig[size];

  const center = config.svgSize / 2;
  const radius = center - config.strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedScore / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: config.svgSize, height: config.svgSize }}>
        <svg
          width={config.svgSize}
          height={config.svgSize}
          viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
          className="-rotate-90"
          style={{ filter: color.glow }}
        >
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-slate-700/50"
          />
          {/* Score ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", config.fontSize, color.text)}>
            {clampedScore}
          </span>
        </div>
      </div>
      {label && (
        <span className={cn("text-slate-400 font-medium", config.labelSize)}>
          {label}
        </span>
      )}
    </div>
  );
}
