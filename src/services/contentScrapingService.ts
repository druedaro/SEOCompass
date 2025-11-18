import { supabase } from '@/config/supabase';
import { getProjectUrlById } from './projectUrlsService';
import type { ScrapedContent, ScrapeOptions, AuditHistoryEntry } from '@/types/audit';

export type { ScrapedContent, ScrapeOptions, AuditHistoryEntry };

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
      return_html: true,
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

export async function getAuditHistory(projectUrlId: string): Promise<AuditHistoryEntry[]> {
  const { data, error } = await supabase
    .from('content_audits')
    .select('id, created_at, overall_score, meta_score, content_score, technical_score, on_page_score, recommendations')
    .eq('project_url_id', projectUrlId)
    .order('created_at', { ascending: true })
    .limit(30);

  if (error) throw new Error('Failed to fetch audit history');
  return data || [];
}
