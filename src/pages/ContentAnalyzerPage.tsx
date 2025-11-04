import { useState } from 'react';
import { UrlInputForm } from '@/components/organisms/UrlInputForm';
import { AuditResultsTable } from '@/components/organisms/AuditResultsTable';
import { scrapeUrl } from '@/services/contentScrapingService';
import { parseHTMLContent } from '@/utils/htmlParser';
import { analyzeKeywords } from '@/utils/keywordAnalyzer';
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
} from '@/utils/validators';
import {
  calculateSEOScore,
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

  const analyzePage = async (data: { url: string }) => {
    setIsAnalyzing(true);
    setRecommendations([]);
    setScoreBreakdown(null);

    try {
      toast({
        title: 'Scraping page...',
        description: 'Fetching content from the URL',
      });

      const scrapedContent = await scrapeUrl(data.url);
      const parsedContent = parseHTMLContent(scrapedContent.html, data.url);

      // Check for critical errors (404, etc.)
      const has404Error = scrapedContent.statusCode === 404;
      const hasServerError = scrapedContent.statusCode >= 500;

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

      // Count and validate links
      const internalLinks = parsedContent.links.filter((link) => link.isInternal).length;
      const externalLinks = parsedContent.links.filter((link) => link.isExternal).length;
      const linksValidation = validateLinks({ internal: internalLinks, external: externalLinks });

      // Validate hreflang tags
      const hreflangValidation = validateHreflang(parsedContent.hreflangTags);

      // Validate robots meta tag
      const robotsValidation = validateRobotsMeta(parsedContent.metadata.robots);

      // Analyze keywords
      analyzeKeywords(
        {
          title: parsedContent.metadata.title,
          description: parsedContent.metadata.description,
          h1s,
          bodyText: parsedContent.bodyText,
          url: data.url,
        }
      );

      const keywordOptimization = 70; // Default score

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
        linksValidation,
        hreflangValidation,
        robotsValidation,
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
        canonicalValidation,
        robotsValidation,
        hasStructuredData: parsedContent.hasStructuredData,
        internalLinks,
        externalLinks,
        has404Error,
        hasServerError,
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
            <CardTitle>Analyze Page</CardTitle>
            <CardDescription>
              Enter a URL to get a comprehensive SEO analysis with actionable recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UrlInputForm
              onSubmit={analyzePage}
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
