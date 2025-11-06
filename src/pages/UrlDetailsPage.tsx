import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { AuditHistoryChart } from '@/components/organisms/AuditHistoryChart';
import { AuditResultsTable } from '@/components/organisms/AuditResultsTable';
import { getProjectUrlById } from '@/services/projectUrlsService';
import { getAuditHistory } from '@/services/contentScrapingService';
import type { ProjectUrl } from '@/services/projectUrlsService';
import type { AuditHistoryEntry } from '@/services/contentScrapingService';

export function UrlDetailsPage() {
  const { projectId, urlId } = useParams<{ projectId: string; urlId: string }>();
  const navigate = useNavigate();
  const [projectUrl, setProjectUrl] = useState<ProjectUrl | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAudit, setLatestAudit] = useState<AuditHistoryEntry | null>(null);

  useEffect(() => {
    if (urlId) {
      loadUrlDetails();
    }
  }, [urlId]);

  const loadUrlDetails = async () => {
    if (!urlId) return;

    try {
      setIsLoading(true);
      const urlData = await getProjectUrlById(urlId);
      setProjectUrl(urlData);

      const history = await getAuditHistory(urlId);
      setAuditHistory(history);
      
      if (history.length > 0) {
        setLatestAudit(history[history.length - 1]);
      }
    } catch (error) {
      console.error('Error loading URL details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading URL details...</p>
      </div>
    );
  }

  if (!projectUrl) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>URL not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/projects/${projectId}/content`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Analyzer
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{projectUrl.label || 'Untitled URL'}</h1>
            <p className="text-muted-foreground break-all">{projectUrl.url}</p>
          </div>
        </div>

        {/* Audit History Chart */}
        {auditHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>
                Performance trend over time (last 30 audits)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditHistoryChart projectUrlId={urlId!} urlLabel={projectUrl.label || projectUrl.url} />
            </CardContent>
          </Card>
        )}

        {/* Latest Audit Results */}
        {latestAudit && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Latest Audit Results</CardTitle>
                  <CardDescription>
                    Last audited: {new Date(latestAudit.created_at).toLocaleString()}
                  </CardDescription>
                </div>
                <Button size="sm" disabled title="Task management coming in Phase 9">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AuditResultsTable
                recommendations={latestAudit.recommendations || []}
                overallScore={latestAudit.overall_score}
                categoryScores={{
                  meta: latestAudit.meta_score,
                  content: latestAudit.content_score,
                  technical: latestAudit.technical_score,
                  onPage: latestAudit.on_page_score,
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* No audits state */}
        {auditHistory.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No audits performed yet for this URL.
              </p>
              <Link to={`/dashboard/projects/${projectId}/content`}>
                <Button className="mt-4">
                  Run First Audit
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
