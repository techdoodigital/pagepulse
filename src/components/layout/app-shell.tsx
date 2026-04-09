"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface AppShellProps {
  user: { id: string; name: string | null; email: string; role?: string };
  children: React.ReactNode;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/audit/new", label: "New Audit" },
  { href: "/pricing", label: "Pricing" },
  { href: "/account", label: "Account" },
  { href: "/support", label: "Support" },
];

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              CiteAudit
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-slate-100 bg-slate-800"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-md text-sm transition ${
                    pathname.startsWith("/admin")
                      ? "text-teal-400 bg-teal-500/10"
                      : "text-teal-400/70 hover:text-teal-400 hover:bg-teal-500/10"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden md:block">
              {user.name || user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-slate-400 hover:text-slate-200 transition hidden md:block"
            >
              Sign out
            </button>
            {/* Hamburger button (mobile only) */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm transition ${
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-slate-100 bg-slate-800"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm transition ${
                    pathname.startsWith("/admin")
                      ? "text-teal-400 bg-teal-500/10"
                      : "text-teal-400/70 hover:text-teal-400 hover:bg-teal-500/10"
                  }`}
                >
                  Admin
                </Link>
              )}
              <div className="border-t border-slate-800 mt-1 pt-2 px-3 flex items-center justify-between">
                <span className="text-sm text-slate-400 truncate">
                  {user.name || user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-slate-400 hover:text-slate-200 transition"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
