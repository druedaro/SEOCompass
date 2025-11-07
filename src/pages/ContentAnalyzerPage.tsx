import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { ProjectUrlsList } from '@/components/organisms/ProjectUrlsList';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { scrapeByProjectUrlId } from '@/services/contentScrapingService';
import { getProjectUrls, type ProjectUrl } from '@/services/projectUrlsService';
import { supabase } from '@/lib/supabaseClient';
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
} from '@/utils/scoreCalculator';
import { generateRecommendations } from '@/utils/recommendationsEngine';
import { useToast } from '@/hooks/useToast';

export default function ContentAnalyzerPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
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

      // Save audit to database
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
          console.error('Error saving audit:', insertError);
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

  if (isLoadingUrls) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <p>Loading project URLs...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back button */}
        {projectId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/projects/${projectId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
        )}
        
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

        {urls.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No URLs Configured</CardTitle>
              <CardDescription>
                Get started by adding URLs to track for this project
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground max-w-md">
                  To analyze content and track SEO performance, you need to add URLs to your project.
                  You can add up to 45 URLs per project.
                </p>
                {projectId && (
                  <Link to={`/dashboard/projects/${projectId}/urls`}>
                    <Button>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure URLs
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
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
          </>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}
