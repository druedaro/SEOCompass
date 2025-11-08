import { supabase } from '@/lib/supabaseClient';
import { getProjectUrlById } from './projectUrlsService';

export interface ScrapedContent {
  html: string;
  statusCode: number;
  finalUrl: string;
  headers: Record<string, string>;
  projectUrlId?: string;
}

export interface ScrapeOptions {
  renderJs?: boolean;
  premiumProxy?: boolean;
  countryCode?: string;
}

/**
 * Scrape a URL by project_url_id
 * Fetches the URL from the database and then scrapes it
 */
export async function scrapeByProjectUrlId(
  projectUrlId: string,
  options: ScrapeOptions = {}
): Promise<ScrapedContent> {
  // Get the URL from the database
  const projectUrl = await getProjectUrlById(projectUrlId);
  
  if (!projectUrl) {
    throw new Error('Project URL not found');
  }

  // Scrape the URL
  const scrapedData = await scrapeUrl(projectUrl.url, options);
  
  // Return with project_url_id attached
  return {
    ...scrapedData,
    projectUrlId,
  };
}

/**
 * Scrape a URL using the scrape-serp edge function
 * This protects the API key on the server side
 */
export async function scrapeUrl(
  url: string,
  options: ScrapeOptions = {}
): Promise<ScrapedContent> {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-serp', {
      body: {
        url,
        return_html: true, // Request full HTML instead of extracted data
        render_js: options.renderJs ?? true,
      },
    });

    if (error) {
      throw new Error(`Scraping error: ${error.message}`);
    }

    if (!data || !data.html) {
      throw new Error('Invalid response from scraping service');
    }

    return {
      html: data.html,
      statusCode: data.status_code || 200,
      finalUrl: data.final_url || url,
      headers: data.headers || {},
    };
  } catch (err) {
    const error = err as Error;
    console.error('Content scraping failed:', error);
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
}

/**
 * Scrape multiple URLs in sequence
 * Returns an array of results with success/error status for each
 */
export async function scrapeMultipleUrls(
  urls: string[],
  options: ScrapeOptions = {}
): Promise<Array<{ url: string; success: boolean; data?: ScrapedContent; error?: string }>> {
  const results = [];

  for (const url of urls) {
    try {
      const data = await scrapeUrl(url, options);
      results.push({ url, success: true, data });
    } catch (err) {
      const error = err as Error;
      results.push({ url, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Check if a URL is accessible (returns 200-299 status)
 */
export async function checkUrlStatus(url: string): Promise<{
  accessible: boolean;
  statusCode: number;
  redirected: boolean;
  finalUrl: string;
}> {
  try {
    const result = await scrapeUrl(url);
    return {
      accessible: result.statusCode >= 200 && result.statusCode < 300,
      statusCode: result.statusCode,
      redirected: result.finalUrl !== url,
      finalUrl: result.finalUrl,
    };
  } catch (err) {
    const error = err as Error;
    console.error('URL status check failed:', error);
    return {
      accessible: false,
      statusCode: 0,
      redirected: false,
      finalUrl: url,
    };
  }
}

export interface AuditHistoryEntry {
  id: string;
  created_at: string;
  overall_score: number;
  meta_score: number;
  content_score: number;
  technical_score: number;
  on_page_score: number;
  recommendations?: any[];
}

/**
 * Get audit history for a specific project URL
 */
export async function getAuditHistory(projectUrlId: string): Promise<AuditHistoryEntry[]> {
  const { data, error } = await supabase
    .from('content_audits')
    .select('id, created_at, overall_score, meta_score, content_score, technical_score, on_page_score, recommendations')
    .eq('project_url_id', projectUrlId)
    .order('created_at', { ascending: true })
    .limit(30);

  if (error) {
    console.error('Error fetching audit history:', error);
    throw new Error('Failed to fetch audit history');
  }

  return data || [];
}
