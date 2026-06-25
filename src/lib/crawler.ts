import { chromium } from "playwright";
import { GraphData, GraphNode, GraphEdge, CrawlOptions } from "@/types";

// normalize url — remove trailing slash, query params, hash
function normalizeUrl(url: string): string {
  const parsed = new URL(url);
  const pathname =
    parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/$/, "");
  return parsed.origin + pathname;
}

function deduplicateEdges(edges: GraphEdge[]): GraphEdge[] {
  const seen = new Set<string>();
  return edges.filter((edge) => {
    const key = `${edge.source}|${edge.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function crawlWebsite(options: CrawlOptions): Promise<GraphData> {
  const { url, depth, maxPages } = options;

  const browser = await chromium.launch();

  const visited = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const outEdgeCount: Record<string, number> = {};

  const startUrl = normalizeUrl(url);
  const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }];

  const origin = new URL(url).origin;
  const domain = new URL(url).hostname;

  while (queue.length > 0 && visited.size < maxPages) {
    const current = queue.shift()!;

    if (visited.has(current.url)) continue;
    if (current.depth > depth) continue;

    const page = await browser.newPage();

    try {
      // block images, fonts, css to speed up crawl
      await page.route(
        "**/*.{png,jpg,jpeg,gif,svg,css,woff,woff2,ttf}",
        (route) => route.abort(),
      );

      const response = await page.goto(current.url, {
        timeout: 15000,
        waitUntil: "domcontentloaded",
      });

      const statusCode = response?.status() ?? 0;
      const title = await page.title();

      // extract all links on the page
      const links = await page.$$eval("a[href]", (els) =>
        els.map((el) => (el as HTMLAnchorElement).href),
      );

      // add current page to visited
      visited.set(current.url, {
        id: current.url,
        url: current.url,
        title,
        depth: current.depth,
        statusCode,
        inDegree: 0,
        outDegree: 0,
      });

      console.log(
        `✓ [${statusCode}] ${current.url} — ${links.length} links found`,
      );

      // filter same-domain links only
      for (const link of links) {
        try {
          const parsed = new URL(link);

          // only same origin
          if (parsed.origin !== origin) continue;

          // normalize url — removes trailing slash, query params, hash
          const cleanUrl = normalizeUrl(link);

          // skip self links
          if (cleanUrl === current.url) continue;

          // limit outgoing edges per node to 50
          outEdgeCount[current.url] = (outEdgeCount[current.url] ?? 0) + 1;
          if (outEdgeCount[current.url] > 50) continue;

          // add edge
          edges.push({ source: current.url, target: cleanUrl });

          // add to queue if not visited
          if (!visited.has(cleanUrl)) {
            queue.push({ url: cleanUrl, depth: current.depth + 1 });
          }
        } catch {
          // invalid url — skip
        }
      }
    } catch (err) {
      console.error(`✗ failed to crawl ${current.url}:`, err);

      // still add to visited with status 0
      visited.set(current.url, {
        id: current.url,
        url: current.url,
        title: "",
        depth: current.depth,
        statusCode: 0,
        inDegree: 0,
        outDegree: 0,
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // deduplicate edges
  const dedupedEdges = deduplicateEdges(edges);

  // calculate inDegree and outDegree
  for (const edge of dedupedEdges) {
    const source = visited.get(edge.source);
    const target = visited.get(edge.target);
    if (source) source.outDegree++;
    if (target) target.inDegree++;
  }

  const nodes = Array.from(visited.values());

  console.log(
    `\ncrawl complete — ${nodes.length} pages, ${dedupedEdges.length} links`,
  );

  return {
    nodes,
    edges: dedupedEdges,
    meta: {
      crawledAt: new Date().toISOString(),
      pageCount: nodes.length,
      domain,
    },
  };
}
