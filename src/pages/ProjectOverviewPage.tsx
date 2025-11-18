import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Settings, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useProject } from '@/hooks/useProject';
import { useAuth } from '@/hooks/useAuth';
import { useProjectStats } from '@/hooks/useProjectStats';
import { useLatestAudit } from '@/hooks/useLatestAudit';
import { formatDistanceToNow } from 'date-fns';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';

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

        <div className="flex items-start justify-between">
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/dashboard/projects/${projectId}/settings`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/dashboard/projects/${projectId}/urls`)}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Manage URLs
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="opacity-50 pointer-events-none">
          <CardHeader className="pb-3">
            <CardDescription>Total Keywords</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Coming in future updates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pages Audited</CardDescription>
            <CardTitle className="text-3xl">{stats.pagesAudited}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.pagesAudited === 0 ? 'No pages audited yet' : `Total audits performed`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open Tasks</CardDescription>
            <CardTitle className="text-3xl">{stats.openTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.openTasks === 0 ? 'No tasks created yet' : `Active tasks to complete`}
            </p>
          </CardContent>
        </Card>
      </div>

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

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/projects/${projectId}/content`)}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Content Analyzer
              {audit && (
                <Badge variant={audit.scores.overall >= 80 ? 'default' : audit.scores.overall >= 60 ? 'secondary' : 'destructive'}>
                  {audit.scores.overall}%
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Audit and optimize your content for SEO
              {audit && (
                <p className="mt-2 text-xs">
                  Last audit: <span className="font-medium">{audit.url}</span>
                  <br />
                  <span className="text-muted-foreground">{formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}</span>
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {audit && (
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content:</span>
                  <span className="font-medium">{audit.scores.content}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meta:</span>
                  <span className="font-medium">{audit.scores.meta}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">On-Page:</span>
                  <span className="font-medium">{audit.scores.onPage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technical:</span>
                  <span className="font-medium">{audit.scores.technical}%</span>
                </div>
              </div>
            )}
            <Button variant="outline" className="w-full">
              Go to Content Analyzer →
            </Button>
          </CardContent>
        </Card>

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

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/projects/${projectId}/actions`)}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Action Center
              {stats.myPendingTasks > 0 && (
                <Badge variant="secondary">{stats.myPendingTasks} pending</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Manage tasks and action items
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.myPendingTasks > 0 ? (
              <p className="text-sm text-muted-foreground mb-4">
                You have {stats.myPendingTasks} pending {stats.myPendingTasks === 1 ? 'task' : 'tasks'} assigned to you
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                No pending tasks assigned to you
              </p>
            )}
            <Button variant="outline" className="w-full">
              Go to Action Center →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
}
