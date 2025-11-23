import { supabase } from '@/config/supabase';
import type { SEOScoreBreakdown, Recommendation } from '@/types/seoTypes';
import type { LatestAudit, AuditHistoryEntry } from '@/types/audit';

export async function saveAuditResults(
  projectId: string,
  projectUrlId: string,
  url: string,
  scores: SEOScoreBreakdown,
  recommendations: Recommendation[]
): Promise<void> {
  const { error } = await supabase.from('content_audits').insert({
    project_id: projectId,
    project_url_id: projectUrlId,
    url,
    overall_score: scores.overall,
    meta_score: scores.meta,
    content_score: scores.content,
    technical_score: scores.technical,
    on_page_score: scores.onPage,
    recommendations,
  });

  if (error) throw error;
}

export async function getLatestAudit(projectId: string): Promise<LatestAudit | null> {
  const { data, error } = await supabase
    .from('content_audits')
    .select('url, created_at, overall_score, meta_score, content_score, technical_score, on_page_score')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) return null;

  const auditData = data[0];
  return {
    url: auditData.url,
    createdAt: auditData.created_at,
    scores: {
      overall: auditData.overall_score || 0,
      content: auditData.content_score || 0,
      meta: auditData.meta_score || 0,
      onPage: auditData.on_page_score || 0,
      technical: auditData.technical_score || 0,
    },
  };
}

export async function getAuditHistory(projectUrlId: string): Promise<AuditHistoryEntry[]> {
  const { data, error } = await supabase
    .from('content_audits')
    .select('id, created_at, overall_score, meta_score, content_score, technical_score, on_page_score, recommendations')
    .eq('project_url_id', projectUrlId)
    .order('created_at', { ascending: true })
    .limit(30);

  if (error) throw error;
  return data || [];
}

export async function getProjectAuditStats(projectId: string): Promise<number> {
  const { count, error } = await supabase
    .from('content_audits')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (error) throw error;
  return count || 0;
}
