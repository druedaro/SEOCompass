import { useState, useEffect } from 'react';
import {
  getProjectUrls,
  addProjectUrl,
  deleteProjectUrl,
  type ProjectUrl,
} from '@/services/projectUrls/projectUrlsService';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

export function useProjectUrls(projectId?: string) {
  const [urls, setUrls] = useState<ProjectUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const loadUrls = async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const data = await getProjectUrls(projectId);
      setUrls(data);
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Error loading URLs: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUrls();
  }, [projectId]);

  const handleAddUrl = async (url: string, label?: string) => {
    if (!projectId || !url.trim()) return;

    if (urls.length >= 45) {
      showErrorToast('Limit Reached: Maximum 45 URLs per project');
      return;
    }

    setIsAdding(true);
    try {
      await addProjectUrl({
        project_id: projectId,
        url: url.trim(),
        label: label?.trim() || undefined,
      });

      showSuccessToast('URL Added Successfully! Ready to analyze');

      await loadUrls();
      return true;
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Failed to add URL: ${err.message}`);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUrl = async (urlId: string) => {
    try {
      await deleteProjectUrl(urlId);
      showSuccessToast('URL deleted successfully');
      await loadUrls();
    } catch (error) {
      const err = error as Error;
      showErrorToast(`Failed to delete URL: ${err.message}`);
    }
  };

  return {
    urls,
    isLoading,
    isAdding,
    handleAddUrl,
    handleDeleteUrl,
  };
}
