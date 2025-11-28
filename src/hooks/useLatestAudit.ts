import { useState, useEffect } from 'react';
import { getLatestAudit } from '@/services/contentAudit/contentAuditService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { LatestAudit } from '@/types/audit';

export function useLatestAudit(projectId: string | undefined) {
  const [audit, setAudit] = useState<LatestAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchLatestAudit = async () => {
      await handleAsyncOperation(
        async () => {
          const data = await getLatestAudit(projectId);
          setAudit(data);
        },
        {
          setLoading: setIsLoading,
          showSuccessToast: false,
          errorMessage: 'Error fetching latest audit',
        }
      );
    };

    fetchLatestAudit();
  }, [projectId]);

  return { audit, isLoading };
}
