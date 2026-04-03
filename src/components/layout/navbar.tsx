"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface NavbarUser {
  name: string;
  email: string;
}

interface NavbarProps {
  user?: NavbarUser | null;
  className?: string;
}

export function Navbar({ user, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            PagePulse
          </span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/audit/new">New Audit</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/account">Account</NavLink>
              <div className="ml-2 h-5 w-px bg-slate-700" />
              <div className="ml-2 flex items-center gap-3">
                <span className="text-sm text-slate-400 hidden sm:inline">
                  {user.name}
                </span>
                <button
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <Link
                href="/signup"
                className="ml-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-600 hover:to-cyan-700 hover:shadow-teal-500/40"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-100"
    >
      {children}
    </Link>
  );
}
