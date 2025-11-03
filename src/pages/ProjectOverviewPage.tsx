import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProject } from '@/hooks/useProject';
import { formatDistanceToNow } from 'date-fns';

export function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject } = useProject();

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
    );
  }

  const createdDate = new Date(currentProject.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
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
            {currentProject.description && (
              <p className="text-muted-foreground mt-2 text-lg">
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
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Keywords</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              No keywords tracked yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pages Audited</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              No pages audited yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open Tasks</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              No tasks created yet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/projects/${projectId}/keywords`)}>
          <CardHeader>
            <CardTitle>Keyword Tracker</CardTitle>
            <CardDescription>
              Track your keyword rankings and visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
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

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/projects/${projectId}/technical`)}>
          <CardHeader>
            <CardTitle>Technical Audit</CardTitle>
            <CardDescription>
              Run technical SEO audits with PageSpeed Insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Go to Technical Audit →
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/dashboard/projects/${projectId}/tasks`)}>
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
  );
}
