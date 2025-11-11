import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { useProjectUrls } from '@/hooks/useProjectUrls';

export default function ProjectUrlsManagementPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { urls, isLoading, isAdding, handleAddUrl, handleDeleteUrl } = useProjectUrls(projectId);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const success = await handleAddUrl(newUrl, newLabel);
    if (success) {
      setNewUrl('');
      setNewLabel('');
    }
  };

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
          Manage up to 45 URLs for content analysis tracking ({urls.length}/45 used)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New URL</CardTitle>
          <CardDescription>
            Add a URL to track and analyze its SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/page"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  disabled={isAdding || urls.length >= 45}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  type="text"
                  placeholder="e.g., Homepage, Blog Post"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  disabled={isAdding || urls.length >= 45}
                />
              </div>
            </div>
            <Button type="submit" disabled={isAdding || urls.length >= 45}>
              <Plus className="mr-2 h-4 w-4" />
              {isAdding ? 'Adding...' : 'Add URL'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project URLs ({urls.length})</CardTitle>
          <CardDescription>
            All URLs tracked in this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {urls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No URLs added yet. Add your first URL above to start tracking.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell className="font-medium">
                      {url.label || '-'}
                    </TableCell>
                    <TableCell>
                      <a
                        href={url.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        {url.url.length > 50 ? `${url.url.substring(0, 50)}...` : url.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(url.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUrlToDelete(url.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
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
