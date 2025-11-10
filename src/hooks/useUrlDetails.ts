import { useState, useEffect } from 'react';
import { getProjectUrlById, type ProjectUrl } from '@/services/projectUrlsService';
import { getAuditHistory, type AuditHistoryEntry } from '@/services/contentScrapingService';
import { useToast } from '@/hooks/useToast';

export function useUrlDetails(urlId?: string) {
  const [projectUrl, setProjectUrl] = useState<ProjectUrl | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAudit, setLatestAudit] = useState<AuditHistoryEntry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (urlId) {
      loadUrlDetails();
    }
  }, [urlId]);

  const loadUrlDetails = async () => {
    if (!urlId) return;

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
      toast({
        title: 'Error loading URL details',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projectUrl,
    auditHistory,
    isLoading,
    latestAudit,
    loadUrlDetails,
  };
}
