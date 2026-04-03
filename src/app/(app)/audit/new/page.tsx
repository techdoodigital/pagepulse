"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Globe, FileText, Upload, X } from "lucide-react";

type SourceTab = "url" | "paste" | "docx";

export default function NewAuditPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SourceTab>("url");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // URL state
  const [url, setUrl] = useState("");

  // Paste state
  const [pasteContent, setPasteContent] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [docxTitle, setDocxTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: SourceTab; label: string; icon: React.ReactNode; description: string }[] = [
    {
      id: "url",
      label: "Published URL",
      icon: <Globe className="h-4 w-4" />,
      description: "Audit a live page by URL",
    },
    {
      id: "paste",
      label: "Paste Content",
      icon: <FileText className="h-4 w-4" />,
      description: "Paste your draft text or HTML",
    },
    {
      id: "docx",
      label: "Upload .docx",
      icon: <Upload className="h-4 w-4" />,
      description: "Upload a Word document",
    },
  ];

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith(".docx")) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Only .docx files are supported.");
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith(".docx")) {
        setError("Only .docx files are supported.");
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10MB.");
        return;
      }
      setFile(selected);
      setError("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res: Response;

      if (activeTab === "url") {
        res = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } else if (activeTab === "paste") {
        res = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceType: "paste",
            content: pasteContent,
            title: pasteTitle || undefined,
          }),
        });
      } else {
        // docx upload
        if (!file) {
          setError("Please select a .docx file to upload.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        if (docxTitle) formData.append("title", docxTitle);

        res = await fetch("/api/audit", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to start audit");
        setLoading(false);
        return;
      }

      router.push(`/audit/${data.auditId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const charCount = pasteContent.length;
  const wordCount = pasteContent.trim() ? pasteContent.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">New Audit</h1>
      <p className="text-sm text-slate-400 mb-8">
        Audit a published page, paste your draft content, or upload a Word
        document. We score across 9 dimensions and generate an actionable
        report.
      </p>

      {/* Tab selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setError("");
            }}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 transition text-center ${
              activeTab === tab.id
                ? "border-teal-500 bg-teal-500/10 text-teal-400"
                : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300"
            }`}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
            <span className="text-xs opacity-60">{tab.description}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                URL to audit
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://example.com/your-article"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
          )}

          {/* Paste Tab */}
          {activeTab === "paste" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Article title{" "}
                <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="e.g., How to Optimize for AI Search"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm mb-4"
              />

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Content{" "}
                <span className="text-slate-500 font-normal">
                  (plain text, markdown, or HTML)
                </span>
              </label>
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                required
                rows={12}
                placeholder={`Paste your article content here...

You can paste:
- Plain text from Google Docs, Notion, etc.
- Markdown with headings (# H1, ## H2)
- Raw HTML from your CMS editor`}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-mono resize-y"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>
                  {wordCount.toLocaleString()} words / {charCount.toLocaleString()} characters
                </span>
                {charCount > 0 && charCount < 100 && (
                  <span className="text-amber-400">
                    Minimum 100 characters required
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "docx" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document title{" "}
                <span className="text-slate-500 font-normal">(optional, extracted from file if empty)</span>
              </label>
              <input
                type="text"
                value={docxTitle}
                onChange={(e) => setDocxTitle(e.target.value)}
                placeholder="e.g., Q1 Content Strategy Guide"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm mb-4"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!file ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center cursor-pointer transition hover:border-teal-500/50 hover:bg-teal-500/5"
                >
                  <Upload className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 mb-1">
                    Drop your .docx file here or{" "}
                    <span className="text-teal-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Word documents up to 10MB. Google Docs can be exported as
                    .docx via File &gt; Download.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {activeTab === "docx" ? "Parsing & auditing..." : "Starting audit..."}
              </span>
            ) : (
              <>
                {activeTab === "url" && "Run Audit"}
                {activeTab === "paste" && "Audit Draft"}
                {activeTab === "docx" && "Upload & Audit"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            What gets analyzed
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              "CSI Alignment",
              "BLUF Quality",
              "Chunk Quality",
              "URR Placement",
              "Cost of Retrieval",
              "Info Density",
              "SRL Salience",
              "TF-IDF Quality",
              "E-E-A-T",
            ].map((dim) => (
              <div
                key={dim}
                className="px-2 py-1.5 rounded-lg bg-slate-800/50 text-xs text-slate-400 text-center"
              >
                {dim}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-3">
            {activeTab === "url"
              ? "How URL audits work"
              : "Draft audit notes"}
          </h3>
          {activeTab === "url" ? (
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex gap-2">
                <span className="text-teal-400">1.</span> We fetch and extract
                your page content
              </li>
              <li className="flex gap-2">
                <span className="text-teal-400">2.</span> AI scores it across 9
                dimensions
              </li>
              <li className="flex gap-2">
                <span className="text-teal-400">3.</span> You get a detailed
                report with before/after examples
              </li>
            </ul>
          ) : (
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex gap-2">
                <span className="text-teal-400">&bull;</span> Draft audits focus
                on content quality, structure, and readability
              </li>
              <li className="flex gap-2">
                <span className="text-teal-400">&bull;</span> Technical SEO
                checks (meta tags, page speed) are skipped for drafts
              </li>
              <li className="flex gap-2">
                <span className="text-teal-400">&bull;</span> Great for
                pre-publish review before your article goes live
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
