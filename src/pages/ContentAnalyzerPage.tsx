import { useState } from 'react';
import { UrlInputForm } from '@/components/organisms/UrlInputForm';
import { AuditResultsTable } from '@/components/organisms/AuditResultsTable';
import { scrapeUrl } from '@/services/contentScrapingService';
import { parseHTMLContent } from '@/utils/htmlParser';
import { analyzeKeywords, analyzeKeyword } from '@/utils/keywordAnalyzer';
import {
  validateTitle,
  validateDescription,
  validateUrl,
  validateH1,
  validateHeadingHierarchy,
  validateImages,
  validateContentLength,
  validateCanonical,
} from '@/utils/validators';
import {
  calculateSEOScore,
  calculateKeywordOptimizationScore,
  type SEOScoreBreakdown,
} from '@/utils/scoreCalculator';
import {
  generateRecommendations,
  type Recommendation,
} from '@/utils/recommendationsEngine';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';

export default function ContentAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState<SEOScoreBreakdown | null>(null);
  const { toast } = useToast();

  const analyzeSinglePage = async (data: { url: string; focusKeyword?: string }) => {
    setIsAnalyzing(true);
    setRecommendations([]);
    setScoreBreakdown(null);

    try {
      // Scrape the page
      toast({
        title: 'Scraping page...',
        description: 'Fetching content from the URL',
      });

      const scrapedContent = await scrapeUrl(data.url);
      const parsedContent = parseHTMLContent(scrapedContent.html, data.url);

      // Extract headings
      const h1s = parsedContent.headings
        .filter((h) => h.level === 1)
        .map((h) => h.text);

      // Validate SEO elements
      const titleValidation = validateTitle(parsedContent.metadata.title);
      const descriptionValidation = validateDescription(parsedContent.metadata.description);
      const urlValidation = validateUrl(data.url);
      const h1Validation = validateH1(h1s);
      const headingHierarchyValidation = validateHeadingHierarchy(parsedContent.headings);
      const imagesValidation = validateImages(parsedContent.images);
      const contentLengthValidation = validateContentLength(parsedContent.wordCount);
      const canonicalValidation = validateCanonical(
        parsedContent.metadata.canonicalUrl,
        data.url
      );

      // Analyze keywords (for potential future use)
      analyzeKeywords(
        {
          title: parsedContent.metadata.title,
          description: parsedContent.metadata.description,
          h1s,
          bodyText: parsedContent.bodyText,
          url: data.url,
        },
        {
          focusKeyword: data.focusKeyword,
        }
      );

      // Count links
      const internalLinks = parsedContent.links.filter((link) => link.isInternal).length;
      const externalLinks = parsedContent.links.filter((link) => link.isExternal).length;

      // Calculate keyword optimization score
      let keywordOptimization = 70; // Default
      let focusKeywordMetrics = undefined;

      if (data.focusKeyword) {
        focusKeywordMetrics = analyzeKeyword(
          data.focusKeyword,
          {
            title: parsedContent.metadata.title,
            description: parsedContent.metadata.description,
            h1s,
            bodyText: parsedContent.bodyText,
            url: data.url,
          },
          parsedContent.wordCount
        );
        keywordOptimization = calculateKeywordOptimizationScore(focusKeywordMetrics);
      }

      // Calculate overall score
      const scoreBreakdown = calculateSEOScore({
        titleValidation,
        descriptionValidation,
        urlValidation,
        h1Validation,
        headingHierarchyValidation,
        imagesValidation,
        contentLengthValidation,
        canonicalValidation,
        hasStructuredData: parsedContent.hasStructuredData,
        keywordOptimization,
        internalLinks,
        externalLinks,
      });

      // Generate recommendations
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
        hasStructuredData: parsedContent.hasStructuredData,
        internalLinks,
        externalLinks,
        focusKeyword: focusKeywordMetrics,
      });

      setScoreBreakdown(scoreBreakdown);
      setRecommendations(recommendations);

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
    }
  };

  const analyzeSitemap = async (data: { sitemapUrl: string; maxPages: number }) => {
    toast({
      title: 'Sitemap analysis',
      description: 'This feature will be available soon',
    });
    console.log('Sitemap analysis:', data);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Content & On-Page Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze your web pages for SEO optimization and get actionable recommendations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Page or Sitemap</CardTitle>
            <CardDescription>
              Enter a URL to analyze a single page, or provide a sitemap URL to analyze multiple
              pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UrlInputForm
              onSubmitSinglePage={analyzeSinglePage}
              onSubmitSitemap={analyzeSitemap}
              isLoading={isAnalyzing}
            />
          </CardContent>
        </Card>

        {scoreBreakdown && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <AuditResultsTable
              recommendations={recommendations}
              overallScore={scoreBreakdown.overall}
              categoryScores={{
                meta: scoreBreakdown.meta,
                content: scoreBreakdown.content,
                technical: scoreBreakdown.technical,
                onPage: scoreBreakdown.onPage,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
