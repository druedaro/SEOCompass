import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Settings, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/Card';
import { useProject } from '@/hooks/useProject';
import { useAuth } from '@/hooks/useAuth';
import { useProjectStats } from '@/hooks/useProjectStats';
import { useLatestAudit } from '@/hooks/useLatestAudit';
import { formatDistanceToNow } from 'date-fns';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { ProjectStatsOverview } from '@/components/organisms/ProjectStatsOverview';
import { ContentAnalyzerCard } from '@/components/molecules/ContentAnalyzerCard';
import { ActionCenterCard } from '@/components/molecules/ActionCenterCard';

export function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject } = useProject();
  const { user } = useAuth();
  const { stats } = useProjectStats(projectId, user?.id);
  const { audit } = useLatestAudit(projectId);

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, projects, setCurrentProject]);

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Project Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The project you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/dashboard/projects')} className="mt-4">
              Back to Projects
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const createdDate = new Date(currentProject.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/projects')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">{currentProject.name}</h1>
              {currentProject.domain && (
                <p className="text-lg text-muted-foreground mt-1">
                  {currentProject.domain}
                </p>
              )}
              {currentProject.description && (
                <p className="text-muted-foreground mt-2">
                  {currentProject.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Created {timeAgo}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/projects/${projectId}/settings`)}
                className="flex-1 md:flex-none"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/projects/${projectId}/urls`)}
                className="flex-1 md:flex-none"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Manage URLs
              </Button>
            </div>
          </div>
        </div>

        <ProjectStatsOverview stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="opacity-50 cursor-not-allowed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Keyword Tracker
                <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
              </CardTitle>
              <CardDescription>
                Track your keyword rankings and visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Go to Keyword Tracker →
              </Button>
            </CardContent>
          </Card>

          <ContentAnalyzerCard projectId={projectId!} audit={audit} />

          <Card className="opacity-50 cursor-not-allowed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Technical Audit
                <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
              </CardTitle>
              <CardDescription>
                Run technical SEO audits with PageSpeed Insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Go to Technical Audit →
              </Button>
            </CardContent>
          </Card>

          <ActionCenterCard projectId={projectId!} pendingTasks={stats.myPendingTasks} />
        </div>
      </div>
    </DashboardLayout>
  );
}
