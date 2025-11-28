import { useParams } from 'react-router-dom';
import { BackButton } from '@/components/atoms/BackButton';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { useProjectUrls } from '@/hooks/useProjectUrls';
import { AddProjectUrlForm } from '@/components/organisms/AddProjectUrlForm';
import { ProjectUrlsTable } from '@/components/organisms/ProjectUrlsTable';

export function ProjectUrlsManagementPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { urls, isLoading, isAdding, handleAddUrl, handleDeleteUrl } = useProjectUrls(projectId);
  
  const deleteConfirmation = useDeleteConfirmation<string>({
    onConfirm: async (urlId) => {
      await handleDeleteUrl(urlId);
    },
    itemName: 'URL',
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <p>Loading URLs...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 space-y-6 min-h-[calc(100vh-12rem)]">
        <div>
          <BackButton />

          <h1 className="text-3xl font-bold">Project URLs Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage up to 45 URLs for SEO analysis tools ({urls.length}/45 used)
          </p>
        </div>

        <AddProjectUrlForm
          onAdd={handleAddUrl}
          isAdding={isAdding}
          currentCount={urls.length}
          maxCount={45}
        />

        <ProjectUrlsTable
          urls={urls}
          onDelete={deleteConfirmation.open}
        />
      </div>

      <deleteConfirmation.DialogComponent
        title="Delete URL?"
        description="This will permanently remove this URL from the project."
      />
    </DashboardLayout>
  );
}
