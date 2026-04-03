"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-lg border bg-slate-800/50 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950",
          error
            ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30"
            : "border-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-rose-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
