import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Label } from '@/components/atoms/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { useProject } from '@/hooks/useProject';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { projectSchema, ProjectFormData } from '@/schemas/projectSchema';
import { showErrorToast } from '@/lib/toast';

export function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject, updateProject, deleteProject } = useProject();
  const { isOwner } = useWorkspace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    }
  }, [projectId, projects, setCurrentProject]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: 'onBlur',
    defaultValues: {
      name: currentProject?.name || '',
      description: currentProject?.description || '',
    },
  });

  useEffect(() => {
    if (currentProject) {
      reset({
        name: currentProject.name,
        description: currentProject.description || '',
      });
    }
  }, [currentProject, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    if (!currentProject) return;

    try {
      setIsSubmitting(true);
      await updateProject(currentProject.id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentProject) return;

    try {
      setIsDeleting(true);
      await deleteProject(currentProject.id);
      navigate('/dashboard/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      showErrorToast('Failed to delete project', 'Please try again.');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>

        <h1 className="text-4xl font-bold">Project Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your project details and settings
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your project name and description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Website"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your project..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isOwner && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Delete this project</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Once you delete a project, there is no going back. Please be certain.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title={`Delete "${currentProject.name}"?`}
        description="This will permanently delete the project and all its data. This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
    </DashboardLayout>
  );
}
