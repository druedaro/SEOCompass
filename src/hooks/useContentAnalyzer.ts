import { useState } from 'react';
import { scrapeByProjectUrlId } from '@/services/contentScraping/contentScrapingService';
import { supabase } from '@/config/supabase';
import { showErrorToast, showSuccessToast, showInfoToast } from '@/lib/toast';
import { parseHTMLContent, extractH1Texts, countLinks } from '@/features/seo/htmlParser/htmlParser';
import {
  validateTitle,
  validateDescription,
  validateUrl,
  validateH1,
  validateHeadingHierarchy,
  validateImages,
  validateContentLength,
  validateCanonical,
  validateLinks,
  validateHreflang,
  validateRobotsMeta,
  validateHttpStatus,
} from '@/features/seo/validators/validators';
import { calculateSEOScore } from '@/features/seo/scoreCalculator/scoreCalculator';
import { generateRecommendations } from '@/features/seo/recommendationsEngine/recommendationsEngine';
import type {
  SEOScoreBreakdown,
  Recommendation,
  ValidationResults
} from '@/types/seoTypes';

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

      const parsedContent = parseHTMLContent(scrapedContent.html, scrapedContent.finalUrl);

      const h1s = extractH1Texts(parsedContent);
      const errors = validateHttpStatus(scrapedContent);
      const { internal: internalLinks, external: externalLinks } = countLinks(parsedContent);

      const validations: ValidationResults = {
        titleValidation: validateTitle(parsedContent.metadata.title),
        descriptionValidation: validateDescription(parsedContent.metadata.description),
        urlValidation: validateUrl(scrapedContent.finalUrl),
        h1Validation: validateH1(h1s),
        headingHierarchyValidation: validateHeadingHierarchy(parsedContent.headings),
        imagesValidation: validateImages(parsedContent.images),
        contentLengthValidation: validateContentLength(parsedContent.wordCount),
        canonicalValidation: validateCanonical(
          parsedContent.metadata.canonicalUrl,
          scrapedContent.finalUrl
        ),
        linksValidation: validateLinks({ internal: internalLinks, external: externalLinks }),
        hreflangValidation: validateHreflang(parsedContent.hreflangTags),
        robotsValidation: validateRobotsMeta(parsedContent.metadata.robots),
        internalLinks,
        externalLinks,
      };

      const scores = calculateSEOScore({
        ...validations,
        hasStructuredData: parsedContent.hasStructuredData,
      });

      const recommendations = generateRecommendations({
        titleValidation: validations.titleValidation,
        title: parsedContent.metadata.title,
        descriptionValidation: validations.descriptionValidation,
        description: parsedContent.metadata.description,
        urlValidation: validations.urlValidation,
        h1Validation: validations.h1Validation,
        h1s,
        headingHierarchyValidation: validations.headingHierarchyValidation,
        imagesValidation: validations.imagesValidation,
        images: parsedContent.images,
        contentLengthValidation: validations.contentLengthValidation,
        wordCount: parsedContent.wordCount,
        canonicalValidation: validations.canonicalValidation,
        robotsValidation: validations.robotsValidation,
        hasStructuredData: parsedContent.hasStructuredData,
        internalLinks: validations.internalLinks,
        externalLinks: validations.externalLinks,
        has404Error: errors.has404,
        hasServerError: errors.hasServer,
      });

      if (projectId) {
        await saveAuditResults(
          projectId,
          projectUrlId,
          scrapedContent.finalUrl,
          scores,
          recommendations
        );
      }

      showSuccessToast(`Analysis complete! Overall SEO score: ${scores.overall}/100`);
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
