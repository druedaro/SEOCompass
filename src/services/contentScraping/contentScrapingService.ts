import { supabase } from '@/config/supabase';
import { getProjectUrlById } from '../projectUrls/projectUrlsService';
import type { ScrapedContent, ScrapeOptions } from '@/types/audit';

export type { ScrapedContent, ScrapeOptions };

export async function scrapeByProjectUrlId(
  projectUrlId: string,
  options: ScrapeOptions = {}
): Promise<ScrapedContent> {
  const projectUrl = await getProjectUrlById(projectUrlId);

  if (!projectUrl) {
    throw new Error('Project URL not found');
  }

  const scrapedData = await scrapeUrl(projectUrl.url, options);

  return {
    ...scrapedData,
    projectUrlId,
  };
}

export async function scrapeUrl(
  url: string,
  options: ScrapeOptions = {}
): Promise<ScrapedContent> {
  const { data, error } = await supabase.functions.invoke('scrape-serp', {
    body: {
      url,
      render_js: options.renderJs ?? true,
    },
  });

  if (error) throw new Error(`Scraping error: ${error.message}`);
  if (!data || !data.html) throw new Error('Invalid response from scraping service');

  return {
    html: data.html,
    statusCode: data.status_code || 200,
    finalUrl: data.final_url || url,
    headers: data.headers || {},
  };
}

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
  } catch {
    return {
      accessible: false,
      statusCode: 0,
      redirected: false,
      finalUrl: url,
    };
  }
}
