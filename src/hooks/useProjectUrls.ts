import { useState, useEffect } from 'react';
import {
  getProjectUrls,
  addProjectUrl,
  deleteProjectUrl,
  type ProjectUrl,
} from '@/services/projectUrls/projectUrlsService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import { showErrorToast } from '@/lib/toast';

export function useProjectUrls(projectId?: string) {
  const [urls, setUrls] = useState<ProjectUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const loadUrls = async () => {
    if (!projectId) return;

    await handleAsyncOperation(
      async () => {
        const data = await getProjectUrls(projectId);
        setUrls(data);
      },
      {
        setLoading: setIsLoading,
        errorMessage: 'Error loading URLs',
        showSuccessToast: false,
      }
    );
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

    const success = await handleAsyncOperation(
      async () => {
        await addProjectUrl({
          project_id: projectId,
          url: url.trim(),
          label: label?.trim() || undefined,
        });
        await loadUrls();
      },
      {
        setLoading: setIsAdding,
        successMessage: 'URL Added Successfully! Ready to analyze',
      }
    );

    return success;
  };

  const handleDeleteUrl = async (urlId: string) => {
    await handleAsyncOperation(
      async () => {
        await deleteProjectUrl(urlId);
        await loadUrls();
      },
      {
        successMessage: 'URL deleted successfully',
      }
    );
  };

  return {
    urls,
    isLoading,
    isAdding,
    handleAddUrl,
    handleDeleteUrl,
  };
}
