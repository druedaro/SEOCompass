import { useState, useEffect } from 'react';
import {
  getProjectUrls,
  addProjectUrl,
  deleteProjectUrl,
  type ProjectUrl,
} from '@/services/projectUrlsService';
import { useToast } from '@/hooks/useToast';

export function useProjectUrls(projectId?: string) {
  const [urls, setUrls] = useState<ProjectUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadUrls();
    }
  }, [projectId]);

  const loadUrls = async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const data = await getProjectUrls(projectId);
      setUrls(data);
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = async (url: string, label?: string) => {
    if (!projectId || !url.trim()) return;

    if (urls.length >= 45) {
      toast({
        title: 'Limit Reached',
        description: 'Maximum 45 URLs per project',
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    try {
      await addProjectUrl({
        project_id: projectId,
        url: url.trim(),
        label: label?.trim() || undefined,
      });

      toast({
        title: 'URL Added',
        description: 'URL successfully added to project',
      });

      await loadUrls();
      return true;
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUrl = async (urlId: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      await deleteProjectUrl(urlId);
      toast({
        title: 'URL Deleted',
        description: 'URL successfully removed from project',
      });
      await loadUrls();
    } catch (error) {
      const err = error as Error;
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return {
    urls,
    isLoading,
    isAdding,
    handleAddUrl,
    handleDeleteUrl,
    loadUrls,
  };
}
