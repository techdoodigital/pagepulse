import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-slate-800 bg-slate-950",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">
          &copy; 2026 Doo Digital. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            Terms
          </Link>
          <Link
            href="https://doodigital.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            doodigital.co
          </Link>
        </div>
      </div>
    </footer>
  );
}
