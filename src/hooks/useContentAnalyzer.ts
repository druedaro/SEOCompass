import { useState } from 'react';
import { scrapeByProjectUrlId } from '@/services/contentScraping/contentScrapingService';
import { supabase } from '@/config/supabase';
import { analyzeContent } from '@/features/seo/analyzer/analyzer';
import type { SEOScoreBreakdown, Recommendation } from '@/types/seoTypes';
import { showErrorToast, showSuccessToast, showInfoToast } from '@/lib/toast';

async function saveAuditResults(
  projectId: string,
  projectUrlId: string,
  url: string,
  scores: SEOScoreBreakdown,
  recommendations: Recommendation[]
): Promise<void> {
  const { error } = await supabase.from('content_audits').insert({
    project_id: projectId,
    project_url_id: projectUrlId,
    url,
    overall_score: scores.overall,
    meta_score: scores.meta,
    content_score: scores.content,
    technical_score: scores.technical,
    on_page_score: scores.onPage,
    recommendations,
  });

  if (error) throw error;
}

export function useContentAnalyzer(projectId?: string) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAuditingUrlId, setCurrentAuditingUrlId] = useState<string | null>(null);

  const analyzePageByUrlId = async (projectUrlId: string) => {
    setIsAnalyzing(true);
    setCurrentAuditingUrlId(projectUrlId);

    try {
      showInfoToast('Scraping page... Fetching content from the URL');

      const scrapedContent = await scrapeByProjectUrlId(projectUrlId);
      const analysis = analyzeContent(scrapedContent);

      if (projectId) {
        await saveAuditResults(
          projectId,
          projectUrlId,
          scrapedContent.finalUrl,
          analysis.scores,
          analysis.recommendations
        );
      }

      showSuccessToast(`Analysis complete! Overall SEO score: ${analysis.scores.overall}/100`);
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
      setCurrentAuditingUrlId(null);
    }
  };

  return {
    isAnalyzing,
    currentAuditingUrlId,
    analyzePageByUrlId,
  };
}
