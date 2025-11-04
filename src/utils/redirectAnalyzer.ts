import { checkUrlStatus } from '@/services/contentScrapingService';

export interface RedirectChain {
  url: string;
  statusCode: number;
  redirectedTo?: string;
}

export interface LinkCheckResult {
  url: string;
  status: 'ok' | 'redirect' | 'broken' | 'error';
  statusCode: number;
  finalUrl: string;
  redirectChain: RedirectChain[];
  error?: string;
}

export interface BrokenLinksReport {
  totalLinks: number;
  okLinks: number;
  redirects: number;
  brokenLinks: number;
  errors: number;
  results: LinkCheckResult[];
  brokenLinksList: LinkCheckResult[];
  redirectsList: LinkCheckResult[];
}

/**
 * Check if a status code indicates a redirect
 */
function isRedirect(statusCode: number): boolean {
  return statusCode >= 300 && statusCode < 400;
}

/**
 * Check if a status code indicates a broken link
 */
function isBroken(statusCode: number): boolean {
  return statusCode >= 400;
}

/**
 * Check a single URL and detect redirects or broken links
 */
export async function checkLink(url: string): Promise<LinkCheckResult> {
  try {
    const result = await checkUrlStatus(url);
    const redirectChain: RedirectChain[] = [];

    // Build redirect chain if redirected
    if (result.redirected) {
      redirectChain.push({
        url,
        statusCode: result.statusCode,
        redirectedTo: result.finalUrl,
      });
    }

    // Determine status
    let status: LinkCheckResult['status'];
    if (isBroken(result.statusCode)) {
      status = 'broken';
    } else if (isRedirect(result.statusCode) || result.redirected) {
      status = 'redirect';
    } else if (result.accessible) {
      status = 'ok';
    } else {
      status = 'error';
    }

    return {
      url,
      status,
      statusCode: result.statusCode,
      finalUrl: result.finalUrl,
      redirectChain,
    };
  } catch (err) {
    const error = err as Error;
    return {
      url,
      status: 'error',
      statusCode: 0,
      finalUrl: url,
      redirectChain: [],
      error: error.message,
    };
  }
}

/**
 * Check multiple URLs and generate a broken links report
 */
export async function checkMultipleLinks(
  urls: string[],
  options: {
    maxConcurrent?: number;
    onProgress?: (current: number, total: number) => void;
  } = {}
): Promise<BrokenLinksReport> {
  const { maxConcurrent = 5, onProgress } = options;
  const results: LinkCheckResult[] = [];
  const uniqueUrls = [...new Set(urls)]; // Remove duplicates

  // Process URLs in batches
  for (let i = 0; i < uniqueUrls.length; i += maxConcurrent) {
    const batch = uniqueUrls.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map((url) => checkLink(url))
    );
    results.push(...batchResults);

    if (onProgress) {
      onProgress(results.length, uniqueUrls.length);
    }
  }

  // Generate report
  const okLinks = results.filter((r) => r.status === 'ok').length;
  const redirects = results.filter((r) => r.status === 'redirect').length;
  const brokenLinks = results.filter((r) => r.status === 'broken').length;
  const errors = results.filter((r) => r.status === 'error').length;

  return {
    totalLinks: uniqueUrls.length,
    okLinks,
    redirects,
    brokenLinks,
    errors,
    results,
    brokenLinksList: results.filter((r) => r.status === 'broken'),
    redirectsList: results.filter((r) => r.status === 'redirect'),
  };
}

/**
 * Analyze redirect types
 */
export function analyzeRedirectType(statusCode: number): {
  type: string;
  isPermanent: boolean;
  description: string;
} {
  switch (statusCode) {
    case 301:
      return {
        type: '301 Moved Permanently',
        isPermanent: true,
        description: 'The resource has been permanently moved to a new URL.',
      };
    case 302:
      return {
        type: '302 Found (Temporary Redirect)',
        isPermanent: false,
        description: 'The resource is temporarily available at a different URL.',
      };
    case 307:
      return {
        type: '307 Temporary Redirect',
        isPermanent: false,
        description: 'Temporary redirect, request method must not be changed.',
      };
    case 308:
      return {
        type: '308 Permanent Redirect',
        isPermanent: true,
        description: 'Permanent redirect, request method must not be changed.',
      };
    default:
      return {
        type: `${statusCode} Redirect`,
        isPermanent: false,
        description: 'Unknown redirect type.',
      };
  }
}

/**
 * Detect redirect chains and calculate their length
 */
export function detectRedirectChains(
  results: LinkCheckResult[]
): Array<{
  originalUrl: string;
  finalUrl: string;
  chainLength: number;
  chain: RedirectChain[];
}> {
  return results
    .filter((r) => r.status === 'redirect' && r.redirectChain.length > 0)
    .map((r) => ({
      originalUrl: r.url,
      finalUrl: r.finalUrl,
      chainLength: r.redirectChain.length,
      chain: r.redirectChain,
    }))
    .filter((chain) => chain.chainLength > 1); // Only chains with 2+ redirects
}

/**
 * Group broken links by status code
 */
export function groupBrokenLinksByStatus(
  brokenLinks: LinkCheckResult[]
): Record<number, LinkCheckResult[]> {
  const grouped: Record<number, LinkCheckResult[]> = {};

  brokenLinks.forEach((link) => {
    if (!grouped[link.statusCode]) {
      grouped[link.statusCode] = [];
    }
    grouped[link.statusCode].push(link);
  });

  return grouped;
}

/**
 * Get description for HTTP status codes
 */
export function getStatusCodeDescription(statusCode: number): string {
  const descriptions: Record<number, string> = {
    200: 'OK - The request was successful',
    301: 'Moved Permanently',
    302: 'Found (Temporary Redirect)',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    410: 'Gone',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };

  return descriptions[statusCode] || `HTTP ${statusCode}`;
}
