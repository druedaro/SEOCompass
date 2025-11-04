/**
 * Redirect & Link Analyzer - Simplified
 * Detect redirects, broken links, and HTTP status issues
 */

export interface LinkCheckResult {
  url: string;
  status: 'ok' | 'redirect' | 'broken' | 'error';
  statusCode: number;
  finalUrl: string;
  error?: string;
}

export interface BrokenLinksReport {
  totalLinks: number;
  okLinks: number;
  redirects: number;
  brokenLinks: number;
  results: LinkCheckResult[];
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
 * Check a single URL status (basic fetch)
 */
export async function checkLink(url: string): Promise<LinkCheckResult> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
    });

    const statusCode = response.status;
    let finalUrl = url;
    let status: LinkCheckResult['status'];

    // Check for redirect
    if (isRedirect(statusCode)) {
      const location = response.headers.get('location');
      finalUrl = location || url;
      status = 'redirect';
    } else if (isBroken(statusCode)) {
      status = 'broken';
    } else if (statusCode === 200) {
      status = 'ok';
    } else {
      status = 'error';
    }

    return {
      url,
      status,
      statusCode,
      finalUrl,
    };
  } catch (err) {
    const error = err as Error;
    return {
      url,
      status: 'error',
      statusCode: 0,
      finalUrl: url,
      error: error.message,
    };
  }
}

/**
 * Check multiple URLs and generate a report
 */
export async function checkMultipleLinks(
  urls: string[],
  maxConcurrent = 5
): Promise<BrokenLinksReport> {
  const results: LinkCheckResult[] = [];
  const uniqueUrls = [...new Set(urls)];

  // Process URLs in batches
  for (let i = 0; i < uniqueUrls.length; i += maxConcurrent) {
    const batch = uniqueUrls.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(batch.map((url) => checkLink(url)));
    results.push(...batchResults);
  }

  return {
    totalLinks: uniqueUrls.length,
    okLinks: results.filter((r) => r.status === 'ok').length,
    redirects: results.filter((r) => r.status === 'redirect').length,
    brokenLinks: results.filter((r) => r.status === 'broken').length,
    results,
  };
}

/**
 * Get description for HTTP status codes
 */
export function getStatusCodeDescription(statusCode: number): string {
  const descriptions: Record<number, string> = {
    200: 'OK',
    301: 'Moved Permanently',
    302: 'Temporary Redirect',
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
