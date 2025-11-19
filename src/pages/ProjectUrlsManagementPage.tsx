import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { useProjectUrls } from '@/hooks/useProjectUrls';
import { AddProjectUrlForm } from '@/components/organisms/AddProjectUrlForm';
import { ProjectUrlsTable } from '@/components/organisms/ProjectUrlsTable';

export default function ProjectUrlsManagementPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { urls, isLoading, isAdding, handleAddUrl, handleDeleteUrl } = useProjectUrls(projectId);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!urlToDelete) return;

    setIsDeleting(true);
    await handleDeleteUrl(urlToDelete);
    setIsDeleting(false);
    setUrlToDelete(null);
  };

  const cancelDelete = () => {
    setUrlToDelete(null);
  };

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/projects/${projectId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project Dashboard
          </Button>

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
          onDelete={setUrlToDelete}
        />
      </div>

      <DeleteConfirmationDialog
        open={!!urlToDelete}
        onOpenChange={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete URL?"
        description="This will permanently remove this URL from the project."
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
