import { scrapeUrl } from './contentScrapingService';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export interface ParsedSitemap {
  urls: SitemapUrl[];
  isSitemapIndex: boolean;
  sitemapUrls: string[];
  totalUrls: number;
}

/**
 * Parse XML sitemap content
 */
function parseSitemapXML(xml: string): ParsedSitemap {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // Check if it's a sitemap index
  const sitemapElements = doc.querySelectorAll('sitemap > loc');
  if (sitemapElements.length > 0) {
    const sitemapUrls = Array.from(sitemapElements).map(
      (el) => el.textContent || ''
    ).filter(Boolean);

    return {
      urls: [],
      isSitemapIndex: true,
      sitemapUrls,
      totalUrls: 0,
    };
  }

  // Parse regular sitemap
  const urlElements = doc.querySelectorAll('url');
  const urls: SitemapUrl[] = [];

  urlElements.forEach((urlEl) => {
    const loc = urlEl.querySelector('loc')?.textContent;
    if (loc) {
      const lastmod = urlEl.querySelector('lastmod')?.textContent || undefined;
      const changefreq = urlEl.querySelector('changefreq')?.textContent || undefined;
      const priorityText = urlEl.querySelector('priority')?.textContent;
      const priority = priorityText ? parseFloat(priorityText) : undefined;

      urls.push({
        loc,
        lastmod,
        changefreq,
        priority,
      });
    }
  });

  return {
    urls,
    isSitemapIndex: false,
    sitemapUrls: [],
    totalUrls: urls.length,
  };
}

/**
 * Fetch and parse a sitemap from a URL
 */
export async function fetchSitemap(sitemapUrl: string): Promise<ParsedSitemap> {
  try {
    const { html } = await scrapeUrl(sitemapUrl);
    return parseSitemapXML(html);
  } catch (error) {
    console.error('Failed to fetch sitemap:', error);
    throw new Error(`Failed to fetch sitemap from ${sitemapUrl}`);
  }
}

/**
 * Fetch and parse sitemap index and all child sitemaps
 */
export async function fetchAllSitemaps(
  sitemapUrl: string
): Promise<SitemapUrl[]> {
  const allUrls: SitemapUrl[] = [];

  try {
    const sitemap = await fetchSitemap(sitemapUrl);

    if (sitemap.isSitemapIndex) {
      // Fetch all child sitemaps
      for (const childSitemapUrl of sitemap.sitemapUrls) {
        try {
          const childSitemap = await fetchSitemap(childSitemapUrl);
          allUrls.push(...childSitemap.urls);
        } catch (error) {
          console.error(`Failed to fetch child sitemap ${childSitemapUrl}:`, error);
        }
      }
    } else {
      allUrls.push(...sitemap.urls);
    }

    return allUrls;
  } catch (error) {
    console.error('Failed to fetch sitemaps:', error);
    throw error;
  }
}

/**
 * Discover sitemap URL from a website
 * Checks common locations: /sitemap.xml, /sitemap_index.xml, robots.txt
 */
export async function discoverSitemap(
  websiteUrl: string
): Promise<string | null> {
  const baseUrl = new URL(websiteUrl).origin;
  const commonLocations = [
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap_index.xml`,
    `${baseUrl}/sitemap-index.xml`,
    `${baseUrl}/sitemap1.xml`,
  ];

  // Try common locations first
  for (const location of commonLocations) {
    try {
      await fetchSitemap(location);
      return location; // Found a valid sitemap
    } catch (error) {
      // Continue to next location
    }
  }

  // Try to find sitemap in robots.txt
  try {
    const robotsUrl = `${baseUrl}/robots.txt`;
    const { html } = await scrapeUrl(robotsUrl);
    const sitemapMatch = html.match(/Sitemap:\s*(.+)/i);
    if (sitemapMatch) {
      const sitemapUrl = sitemapMatch[1].trim();
      // Verify it's a valid sitemap
      await fetchSitemap(sitemapUrl);
      return sitemapUrl;
    }
  } catch (error) {
    // robots.txt not found or doesn't contain sitemap
  }

  return null; // No sitemap found
}

/**
 * Filter sitemap URLs by pattern
 */
export function filterSitemapUrls(
  urls: SitemapUrl[],
  pattern?: string
): SitemapUrl[] {
  if (!pattern) return urls;

  const regex = new RegExp(pattern, 'i');
  return urls.filter((url) => regex.test(url.loc));
}

/**
 * Group sitemap URLs by domain path
 */
export function groupUrlsByPath(urls: SitemapUrl[]): Record<string, SitemapUrl[]> {
  const groups: Record<string, SitemapUrl[]> = {};

  urls.forEach((url) => {
    try {
      const urlObj = new URL(url.loc);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      const topLevelPath = pathParts[0] || 'root';

      if (!groups[topLevelPath]) {
        groups[topLevelPath] = [];
      }
      groups[topLevelPath].push(url);
    } catch (error) {
      // Invalid URL, skip
    }
  });

  return groups;
}
