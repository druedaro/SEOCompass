-- Create content_audits table
CREATE TABLE IF NOT EXISTS public.content_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('single_page', 'sitemap')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  overall_score INTEGER,
  total_issues INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  warning_issues INTEGER DEFAULT 0,
  info_issues INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Create content_audit_issues table
CREATE TABLE IF NOT EXISTS public.content_audit_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.content_audits(id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  category TEXT NOT NULL CHECK (category IN ('meta', 'headings', 'images', 'links', 'keywords', 'structure', 'performance')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  element_selector TEXT,
  current_value TEXT,
  expected_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_content_audits_project_id ON public.content_audits(project_id);
CREATE INDEX idx_content_audits_created_at ON public.content_audits(created_at DESC);
CREATE INDEX idx_content_audits_status ON public.content_audits(status);
CREATE INDEX idx_content_audit_issues_audit_id ON public.content_audit_issues(audit_id);
CREATE INDEX idx_content_audit_issues_severity ON public.content_audit_issues(severity);
CREATE INDEX idx_content_audit_issues_category ON public.content_audit_issues(category);

-- Enable Row Level Security
ALTER TABLE public.content_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_audits
CREATE POLICY "Users can view audits of their team projects"
  ON public.content_audits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = content_audits.project_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create audits for their team projects"
  ON public.content_audits
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = content_audits.project_id
      AND tm.user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update audits of their team projects"
  ON public.content_audits
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = content_audits.project_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete audits they created"
  ON public.content_audits
  FOR DELETE
  USING (created_by = auth.uid());

-- RLS Policies for content_audit_issues
CREATE POLICY "Users can view issues of their team audits"
  ON public.content_audit_issues
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.content_audits ca
      INNER JOIN public.projects p ON ca.project_id = p.id
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE ca.id = content_audit_issues.audit_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert issues for their team audits"
  ON public.content_audit_issues
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content_audits ca
      INNER JOIN public.projects p ON ca.project_id = p.id
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE ca.id = content_audit_issues.audit_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete issues of their team audits"
  ON public.content_audit_issues
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.content_audits ca
      INNER JOIN public.projects p ON ca.project_id = p.id
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE ca.id = content_audit_issues.audit_id
      AND tm.user_id = auth.uid()
    )
  );
