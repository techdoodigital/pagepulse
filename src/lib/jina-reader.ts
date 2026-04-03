export async function fetchUrlAsMarkdown(url: string): Promise<{ title: string; content: string }> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const headers: Record<string, string> = {
    "Accept": "text/markdown",
  };
  if (process.env.JINA_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.JINA_API_KEY}`;
  }

  const response = await fetch(jinaUrl, { headers });
  if (!response.ok) {
    throw new Error(`Jina Reader failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();

  // Extract title from first markdown heading
  const titleMatch = text.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;

  return { title, content: text };
}
