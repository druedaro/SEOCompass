import { useState } from 'react';
import { scrapeByProjectUrlId, type ScrapedContent } from '@/services/contentScrapingService';
import { supabase } from '@/config/supabase';
import { parseHTMLContent, type ParsedContent } from '@/features/seo/htmlParser';
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
} from '@/features/seo/validators';
import { calculateSEOScore, type SEOScoreBreakdown } from '@/features/seo/scoreCalculator';
import { generateRecommendations, type Recommendation } from '@/features/seo/recommendationsEngine';
import { showErrorToast, showSuccessToast, showInfoToast } from '@/lib/toast';
import type { ValidationResults } from '@/types/hooks';

function extractH1Texts(parsedContent: ParsedContent): string[] {
  return parsedContent.headings
    .filter((h) => h.level === 1)
    .map((h) => h.text);
}

function countLinks(parsedContent: ParsedContent): { internal: number; external: number } {
  const internal = parsedContent.links.filter((link) => link.isInternal).length;
  const external = parsedContent.links.filter((link) => link.isExternal).length;
  return { internal, external };
}

function checkErrors(scrapedContent: ScrapedContent): { has404: boolean; hasServer: boolean } {
  return {
    has404: scrapedContent.statusCode === 404,
    hasServer: scrapedContent.statusCode >= 500,
  };
}

function performValidations(
  parsedContent: ParsedContent,
  scrapedContent: ScrapedContent,
  h1s: string[]
): ValidationResults {
  const { internal: internalLinks, external: externalLinks } = countLinks(parsedContent);

  return {
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
}

function computeScores(
  validations: ValidationResults,
  parsedContent: ParsedContent
): SEOScoreBreakdown {
  return calculateSEOScore({
    ...validations,
    hasStructuredData: parsedContent.hasStructuredData,
  });
}

function buildRecommendations(
  validations: ValidationResults,
  parsedContent: ParsedContent,
  h1s: string[],
  errors: { has404: boolean; hasServer: boolean }
): Recommendation[] {
  return generateRecommendations({
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
}

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
      const errors = checkErrors(scrapedContent);
      const validations = performValidations(parsedContent, scrapedContent, h1s);
      const scores = computeScores(validations, parsedContent);
      const recommendations = buildRecommendations(validations, parsedContent, h1s, errors);

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
