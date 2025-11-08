import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { useProject } from '@/hooks/useProject';
import { formatDistanceToNow } from 'date-fns';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { supabase } from '@/lib/supabaseClient';

export function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject } = useProject();
  const [pagesAudited, setPagesAudited] = useState(0);
  const [openTasks, setOpenTasks] = useState(0);

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, projects, setCurrentProject]);

  useEffect(() => {
    const fetchAuditCount = async () => {
      if (!projectId) return;
      
      const { count } = await supabase
        .from('content_audits')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);
      
      setPagesAudited(count || 0);
    };

    const fetchOpenTasksCount = async () => {
      if (!projectId) return;
      
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .neq('status', 'completed')
        .neq('status', 'cancelled');
      
      setOpenTasks(count || 0);
    };

    fetchAuditCount();
    fetchOpenTasksCount();
  }, [projectId]);

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
      {/* Header */}
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
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/projects/${projectId}/settings`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
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
            <CardTitle className="text-3xl">{pagesAudited}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {pagesAudited === 0 ? 'No pages audited yet' : `Total audits performed`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open Tasks</CardDescription>
            <CardTitle className="text-3xl">{openTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {openTasks === 0 ? 'No tasks created yet' : `Active tasks to complete`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
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
            <CardTitle>Content Analyzer</CardTitle>
            <CardDescription>
              Audit and optimize your content for SEO
            </CardDescription>
          </CardHeader>
          <CardContent>
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
            <CardTitle>Action Center</CardTitle>
            <CardDescription>
              Manage tasks and action items
            </CardDescription>
          </CardHeader>
          <CardContent>
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
