import { useState, useEffect } from 'react';
import { getProjectUrlById, type ProjectUrl } from '@/services/projectUrls/projectUrlsService';
import { getAuditHistory } from '@/services/contentAudit/contentAuditService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { AuditHistoryEntry } from '@/types/audit';

export function useUrlDetails(urlId?: string) {
  const [projectUrl, setProjectUrl] = useState<ProjectUrl | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAudit, setLatestAudit] = useState<AuditHistoryEntry | null>(null);

  useEffect(() => {
    if (!urlId) return;

    const loadUrlDetails = async () => {
      await handleAsyncOperation(
        async () => {
          const urlData = await getProjectUrlById(urlId);
          setProjectUrl(urlData);

          const history = await getAuditHistory(urlId);
          setAuditHistory(history);
          
          if (history.length > 0) {
            setLatestAudit(history[history.length - 1]);
          }
        },
        {
          setLoading: setIsLoading,
          showSuccessToast: false,
          errorMessage: 'Error loading URL details',
        }
      );
    };

    loadUrlDetails();
  }, [urlId]);

  return {
    projectUrl,
    auditHistory,
    isLoading,
    latestAudit,
  };
}
