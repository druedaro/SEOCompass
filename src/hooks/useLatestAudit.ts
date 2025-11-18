import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';

interface SEOScores {
  overall: number;
  content: number;
  meta: number;
  onPage: number;
  technical: number;
}

interface LatestAudit {
  url: string;
  createdAt: string;
  scores: SEOScores;
}

export function useLatestAudit(projectId: string | undefined) {
  const [audit, setAudit] = useState<LatestAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchLatestAudit = async () => {
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('content_audits')
          .select('url, created_at, overall_score, meta_score, content_score, technical_score, on_page_score')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const auditData = data[0];
          setAudit({
            url: auditData.url,
            createdAt: auditData.created_at,
            scores: {
              overall: auditData.overall_score || 0,
              content: auditData.content_score || 0,
              meta: auditData.meta_score || 0,
              onPage: auditData.on_page_score || 0,
              technical: auditData.technical_score || 0,
            },
          });
        }
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
