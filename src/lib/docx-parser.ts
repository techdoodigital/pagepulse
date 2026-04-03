import mammoth from "mammoth";

/**
 * Parse a .docx file buffer into markdown-like text content.
 * Returns the extracted text with basic structure preserved.
 */
export async function parseDocx(
  buffer: Buffer
): Promise<{ title: string; content: string }> {
  // Extract as HTML then convert to simple markdown-like text
  const result = await mammoth.convertToHtml({ buffer });

  const html = result.value.trim();

  // Convert HTML to simple text with basic structure
  const markdown = html
    .replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (_, level, text) => '#'.repeat(Number(level)) + ' ' + text.replace(/<[^>]+>/g, ''))
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();

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
  const htmlResult = await mammoth.convertToHtml({ buffer });
  const html = htmlResult.value.trim();

  // Convert HTML to simple markdown-like text
  const markdown = html
    .replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (_, level, text) => '#'.repeat(Number(level)) + ' ' + text.replace(/<[^>]+>/g, ''))
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const titleMatch = markdown.match(/^#+\s+(.+)$/m);
  const title = titleMatch
    ? titleMatch[1].trim()
    : markdown.split("\n")[0]?.replace(/^[#*_\s]+/, "").trim().slice(0, 100) ||
      "Uploaded Document";

  return { title, content: markdown, html };
}
