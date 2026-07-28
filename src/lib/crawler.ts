import * as cheerio from 'cheerio';

export interface CrawlResult {
  url: string;
  title: string;
  content: string;
  links: string[];
}

export async function crawlWebsite(
  startUrl: string,
  maxPages = 50
): Promise<CrawlResult[]> {
  const visited = new Set<string>();
  const queue = [startUrl];
  const results: CrawlResult[] = [];
  const baseUrl = new URL(startUrl).origin;

  while (queue.length > 0 && results.length < maxPages) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'AIWayBot/1.0' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) continue;

      const html = await response.text();
      const $ = cheerio.load(html);

      $('script, style, nav, footer, header').remove();

      const title = $('title').text().trim() || $('h1').first().text().trim();
      const content = $('body').text().replace(/\s+/g, ' ').trim();

      const links: string[] = [];
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href) {
          try {
            const absoluteUrl = new URL(href, url).toString();
            if (absoluteUrl.startsWith(baseUrl) && !visited.has(absoluteUrl)) {
              links.push(absoluteUrl);
            }
          } catch {}
        }
      });

      results.push({ url, title, content, links });
      queue.push(...links);
    } catch {
      continue;
    }
  }

  return results;
}
