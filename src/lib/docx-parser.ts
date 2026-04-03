import mammoth from "mammoth";

/**
 * Parse a .docx file buffer into markdown-like text content.
 * Returns the extracted text with basic structure preserved.
 */
export async function parseDocx(
  buffer: Buffer
): Promise<{ title: string; content: string }> {
  // Extract as markdown-style text
  const result = await mammoth.convertToMarkdown({ buffer });

  const markdown = result.value.trim();

  // Extract title from first heading or first line
  const titleMatch = markdown.match(/^#+\s+(.+)$/m);
  const title = titleMatch
    ? titleMatch[1].trim()
    : markdown.split("\n")[0]?.replace(/^[#*_\s]+/, "").trim().slice(0, 100) ||
      "Uploaded Document";

  return { title, content: markdown };
}

/**
 * Parse a .docx file buffer into HTML for richer structure analysis.
 */
export async function parseDocxToHtml(
  buffer: Buffer
): Promise<{ title: string; content: string; html: string }> {
  const [markdownResult, htmlResult] = await Promise.all([
    mammoth.convertToMarkdown({ buffer }),
    mammoth.convertToHtml({ buffer }),
  ]);

  const markdown = markdownResult.value.trim();
  const html = htmlResult.value.trim();

  const titleMatch = markdown.match(/^#+\s+(.+)$/m);
  const title = titleMatch
    ? titleMatch[1].trim()
    : markdown.split("\n")[0]?.replace(/^[#*_\s]+/, "").trim().slice(0, 100) ||
      "Uploaded Document";

  return { title, content: markdown, html };
}
