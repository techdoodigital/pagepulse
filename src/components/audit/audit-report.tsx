"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface AuditReportProps {
  report: string;
  className?: string;
}

function markdownToHtml(md: string): string {
  let html = md;

  // Escape HTML entities first (but preserve intended markdown)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (``` ... ```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-slate-300">$2</code></pre>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-slate-900 text-indigo-300 px-1.5 py-0.5 rounded text-sm">$1</code>'
  );

  // Headings (process from h4 to h1 to avoid conflicts)
  html = html.replace(
    /^#### (.+)$/gm,
    '<h4 class="text-base font-semibold text-slate-200 mt-6 mb-2">$1</h4>'
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-lg font-semibold text-slate-200 mt-8 mb-3">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-xl font-bold text-slate-100 mt-10 mb-4 pb-2 border-b border-slate-700/50">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-2xl font-bold text-slate-100 mt-10 mb-4">$1</h1>'
  );

  // Bold and italic
  html = html.replace(
    /\*\*\*(.+?)\*\*\*/g,
    '<strong class="font-bold text-slate-100"><em>$1</em></strong>'
  );
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-slate-200">$1</strong>'
  );
  html = html.replace(
    /\*(.+?)\*/g,
    '<em class="italic text-slate-300">$1</em>'
  );

  // Horizontal rules
  html = html.replace(
    /^---$/gm,
    '<hr class="border-slate-700/50 my-6" />'
  );

  // Unordered lists
  html = html.replace(/^(\s*)[-*] (.+)$/gm, (_, indent, content) => {
    const level = Math.floor(indent.length / 2);
    const ml = level > 0 ? ` style="margin-left:${level * 1.25}rem"` : "";
    return `<li class="text-slate-300 text-sm leading-relaxed"${ml}>${content}</li>`;
  });

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /(<li[\s\S]*?<\/li>\n?)+/g,
    '<ul class="list-disc list-inside space-y-1 my-3 pl-2">$&</ul>'
  );

  // Ordered lists
  html = html.replace(
    /^\d+\. (.+)$/gm,
    '<li class="text-slate-300 text-sm leading-relaxed">$1</li>'
  );

  // Blockquotes
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="border-l-2 border-indigo-500/50 pl-4 py-1 my-3 text-slate-400 italic">$1</blockquote>'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Paragraphs: wrap remaining text lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Don't wrap blocks that are already HTML elements
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p class="text-slate-300 text-sm leading-relaxed my-3">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

export function AuditReport({ report, className }: AuditReportProps) {
  const html = markdownToHtml(report);

  return (
    <div
      className={cn("max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
