import type { Recommendation } from './seoTypes';

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

export interface AuditHistoryEntry {
  id: string;
  created_at: string;
  overall_score: number;
  meta_score: number;
  content_score: number;
  technical_score: number;
  on_page_score: number;
  recommendations?: Recommendation[];
}
