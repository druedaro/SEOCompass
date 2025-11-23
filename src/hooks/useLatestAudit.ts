import { useState, useEffect } from 'react';
import { getLatestAudit } from '@/services/contentAudit/contentAuditService';
import type { LatestAudit } from '@/types/audit';

export function useLatestAudit(projectId: string | undefined) {
  const [audit, setAudit] = useState<LatestAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchLatestAudit = async () => {
      setIsLoading(true);

      try {
        const data = await getLatestAudit(projectId);
        setAudit(data);
      } catch (error) {
        console.error('Error fetching latest audit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAudit();
  }, [projectId]);

  return { audit, isLoading };
}
