import { useParams, Link, useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { ProjectUrlsList } from '@/components/organisms/ProjectUrlsList';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useContentAnalyzer } from '@/hooks/useContentAnalyzer';
import { useProjectUrls } from '@/hooks/useProjectUrls';

export default function ContentAnalyzerPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { urls, isLoading: isLoadingUrls } = useProjectUrls(projectId);
  const { isAnalyzing, currentAuditingUrlId, analyzePageByUrlId } = useContentAnalyzer(projectId);

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
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Content & On-Page Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze your tracked URLs for SEO optimization and get actionable recommendations
          </p>
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
                  <Link to={`/dashboard/projects/${projectId}/settings`}>
                    <Button>
                      <Settings className="mr-2 h-4 w-4" />
                      Go to Settings
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
