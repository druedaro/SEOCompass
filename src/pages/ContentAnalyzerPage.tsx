import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { ProjectUrlsList } from '@/components/organisms/ProjectUrlsList';
import { AuditResultsDialog } from '@/components/organisms/AuditResultsDialog';
import { scrapeByProjectUrlId } from '@/services/contentScrapingService';
import { getProjectUrls, type ProjectUrl } from '@/services/projectUrlsService';
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

export default function ContentAnalyzerPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [urls, setUrls] = useState<ProjectUrl[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAuditingUrlId, setCurrentAuditingUrlId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState<SEOScoreBreakdown | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [showResultsDialog, setShowResultsDialog] = useState(false);
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
    setRecommendations([]);
    setScoreBreakdown(null);

    try {
      toast({
        title: 'Scraping page...',
        description: 'Fetching content from the URL',
      });

      const scrapedContent = await scrapeByProjectUrlId(projectUrlId);
      const parsedContent = parseHTMLContent(scrapedContent.html, scrapedContent.finalUrl);

      // Store the URL being analyzed
      setCurrentUrl(scrapedContent.finalUrl);

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
      const urlValidation = validateUrl(scrapedContent.finalUrl);
      const h1Validation = validateH1(h1s);
      const headingHierarchyValidation = validateHeadingHierarchy(parsedContent.headings);
      const imagesValidation = validateImages(parsedContent.images);
      const contentLengthValidation = validateContentLength(parsedContent.wordCount);
      const canonicalValidation = validateCanonical(
        parsedContent.metadata.canonicalUrl,
        scrapedContent.finalUrl
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
          url: scrapedContent.finalUrl,
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

      // Open results dialog
      setShowResultsDialog(true);

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

  if (isLoadingUrls) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading project URLs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Content & On-Page Analyzer</h1>
            <p className="text-muted-foreground">
              Analyze your tracked URLs for SEO optimization and get actionable recommendations
            </p>
          </div>
          {projectId && (
            <Link to={`/dashboard/projects/${projectId}/urls`}>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage URLs
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project URLs</CardTitle>
            <CardDescription>
              Select a URL to analyze its SEO performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectUrlsList
              urls={urls}
              onAudit={analyzePageByUrlId}
              isAuditing={isAnalyzing}
              currentAuditingUrlId={currentAuditingUrlId || undefined}
            />
          </CardContent>
        </Card>

        {/* Audit Results Dialog */}
        {scoreBreakdown && (
          <AuditResultsDialog
            open={showResultsDialog}
            onClose={() => setShowResultsDialog(false)}
            url={currentUrl}
            recommendations={recommendations}
            scoreBreakdown={scoreBreakdown}
          />
        )}
      </div>
    </div>
  );
}
