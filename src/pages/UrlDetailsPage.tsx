import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { AuditHistoryChart } from '@/components/organisms/AuditHistoryChart';
import { AuditResultsTable } from '@/components/organisms/AuditResultsTable';
import { CreateTaskModal } from '@/components/organisms/CreateTaskModal';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useUrlDetails } from '@/hooks/useUrlDetails';
import type { Recommendation } from '@/features/seo/recommendationsEngine';

export function UrlDetailsPage() {
  const { projectId, urlId } = useParams<{ projectId: string; urlId: string }>();
  const navigate = useNavigate();
  const { projectUrl, auditHistory, isLoading, latestAudit } = useUrlDetails(urlId);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading URL details...</p>
      </div>
    );
  }

  if (!projectUrl) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <p>URL not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
                <Button size="sm" onClick={() => setCreateTaskModalOpen(true)}>
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
                urlLabel={projectUrl?.url || ''}
                onAddTask={(recommendation) => {
                  setSelectedRecommendation(recommendation);
                  setCreateTaskModalOpen(true);
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

      {/* Create Task Modal */}
      {projectId && (
        <CreateTaskModal
          open={createTaskModalOpen}
          onOpenChange={setCreateTaskModalOpen}
          projectId={projectId}
          onTaskCreated={() => {
            setCreateTaskModalOpen(false);
          }}
          auditReference={`URL: ${projectUrl?.url}`}
          initialTitle={selectedRecommendation?.title || ''}
          initialDescription={selectedRecommendation?.description || ''}
        />
      )}
    </div>
    </DashboardLayout>
  );
}
