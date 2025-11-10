import { useState, useEffect } from 'react';
import { scrapeByProjectUrlId } from '@/services/contentScrapingService';
import { getProjectUrls, type ProjectUrl } from '@/services/projectUrlsService';
import { supabase } from '@/config/supabase';
import { parseHTMLContent } from '@/features/seo/htmlParser';
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
import { calculateSEOScore } from '@/features/seo/scoreCalculator';
import { generateRecommendations } from '@/features/seo/recommendationsEngine';
import { useToast } from '@/hooks/useToast';

export function useContentAnalyzer(projectId?: string) {
  const [urls, setUrls] = useState<ProjectUrl[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAuditingUrlId, setCurrentAuditingUrlId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadProjectUrls();
    }
  }, [projectId]);

  const loadProjectUrls = async () => {
    if (!projectId) return;

    setIsLoadingUrls(true);
    try {
      const data = await getProjectUrls(projectId);
      setUrls(data);
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Error loading URLs',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingUrls(false);
    }
  };

  const analyzePageByUrlId = async (projectUrlId: string) => {
    setIsAnalyzing(true);
    setCurrentAuditingUrlId(projectUrlId);

    try {
      toast({
        title: 'Scraping page...',
        description: 'Fetching content from the URL',
      });

      const scrapedContent = await scrapeByProjectUrlId(projectUrlId);
      const parsedContent = parseHTMLContent(scrapedContent.html, scrapedContent.finalUrl);

      const has404Error = scrapedContent.statusCode === 404;
      const hasServerError = scrapedContent.statusCode >= 500;

      const h1s = parsedContent.headings
        .filter((h) => h.level === 1)
        .map((h) => h.text);

      const titleValidation = validateTitle(parsedContent.metadata.title);
      const descriptionValidation = validateDescription(parsedContent.metadata.description);
      const urlValidation = validateUrl(scrapedContent.finalUrl);
      const h1Validation = validateH1(h1s);
      const headingHierarchyValidation = validateHeadingHierarchy(parsedContent.headings);
      const imagesValidation = validateImages(parsedContent.images);
      const contentLengthValidation = validateContentLength(parsedContent.wordCount);
      const canonicalValidation = validateCanonical(
        parsedContent.metadata.canonicalUrl,
        scrapedContent.finalUrl
      );

      const internalLinks = parsedContent.links.filter((link) => link.isInternal).length;
      const externalLinks = parsedContent.links.filter((link) => link.isExternal).length;
      const linksValidation = validateLinks({ internal: internalLinks, external: externalLinks });

      const hreflangValidation = validateHreflang(parsedContent.hreflangTags);
      const robotsValidation = validateRobotsMeta(parsedContent.metadata.robots);

      const scoreBreakdown = calculateSEOScore({
        titleValidation,
        descriptionValidation,
        urlValidation,
        h1Validation,
        headingHierarchyValidation,
        imagesValidation,
        contentLengthValidation,
        canonicalValidation,
        linksValidation,
        hreflangValidation,
        robotsValidation,
        hasStructuredData: parsedContent.hasStructuredData,
        internalLinks,
        externalLinks,
      });

      const recommendations = generateRecommendations({
        titleValidation,
        title: parsedContent.metadata.title,
        descriptionValidation,
        description: parsedContent.metadata.description,
        urlValidation,
        h1Validation,
        h1s,
        headingHierarchyValidation,
        imagesValidation,
        images: parsedContent.images,
        contentLengthValidation,
        wordCount: parsedContent.wordCount,
        canonicalValidation,
        robotsValidation,
        hasStructuredData: parsedContent.hasStructuredData,
        internalLinks,
        externalLinks,
        has404Error,
        hasServerError,
      });

      if (projectId) {
        const { error: insertError } = await supabase.from('content_audits').insert({
          project_id: projectId,
          project_url_id: projectUrlId,
          url: scrapedContent.finalUrl,
          overall_score: scoreBreakdown.overall,
          meta_score: scoreBreakdown.meta,
          content_score: scoreBreakdown.content,
          technical_score: scoreBreakdown.technical,
          on_page_score: scoreBreakdown.onPage,
          recommendations: recommendations,
        });

        if (insertError) {
          throw insertError;
        }
      }

      toast({
        title: 'Analysis complete!',
        description: `Overall SEO score: ${scoreBreakdown.overall}/100`,
      });
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Analysis failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentAuditingUrlId(null);
    }
  };

  return {
    urls,
    isLoadingUrls,
    isAnalyzing,
    currentAuditingUrlId,
    analyzePageByUrlId,
    loadProjectUrls,
  };
}
