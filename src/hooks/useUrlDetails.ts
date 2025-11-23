import { useState, useEffect } from 'react';
import { getProjectUrlById, type ProjectUrl } from '@/services/projectUrls/projectUrlsService';
import { getAuditHistory } from '@/services/contentAudit/contentAuditService';
import type { AuditHistoryEntry } from '@/types/audit';
import { showErrorToast } from '@/lib/toast';

export function useUrlDetails(urlId?: string) {
  const [projectUrl, setProjectUrl] = useState<ProjectUrl | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAudit, setLatestAudit] = useState<AuditHistoryEntry | null>(null);

  useEffect(() => {
    if (!urlId) return;

    const loadUrlDetails = async () => {
      try {
        setIsLoading(true);
        const urlData = await getProjectUrlById(urlId);
        setProjectUrl(urlData);

        const history = await getAuditHistory(urlId);
        setAuditHistory(history);
        
        if (history.length > 0) {
          setLatestAudit(history[history.length - 1]);
        }
      } catch (error) {
        const err = error as Error;
        showErrorToast(`Error loading URL details: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
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
