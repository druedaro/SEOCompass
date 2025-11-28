import { useState } from 'react';
import { saveAuditResults } from '@/services/contentAudit/contentAuditService';
import { showSuccessToast, showInfoToast } from '@/lib/toast';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import { AuditOrchestrator } from '@/features/seo/orchestrator/auditOrchestrator';

export function useContentAnalyzer(projectId?: string) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAuditingUrlId, setCurrentAuditingUrlId] = useState<string | null>(null);

  const analyzePageByUrlId = async (projectUrlId: string) => {
    setCurrentAuditingUrlId(projectUrlId);
    showInfoToast('Scraping page... Fetching content from the URL');

    await handleAsyncOperation(
      async () => {
        const orchestrator = new AuditOrchestrator();
        const { scores, recommendations, url } = await orchestrator.runAudit(projectUrlId);

        if (projectId) {
          await saveAuditResults(
            projectId,
            projectUrlId,
            url,
            scores,
            recommendations
          );
        }

        showSuccessToast(`Analysis complete! Overall SEO score: ${scores.overall}/100`);
      },
      {
        setLoading: setIsAnalyzing,
        showSuccessToast: false,
        onError: () => setCurrentAuditingUrlId(null)
      }
    );
    setCurrentAuditingUrlId(null);
  };

  return {
    isAnalyzing,
    currentAuditingUrlId,
    analyzePageByUrlId,
  };
}
