-- Create project_urls table
CREATE TABLE IF NOT EXISTS public.project_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, url)
);

-- Create index for better performance
CREATE INDEX idx_project_urls_project_id ON public.project_urls(project_id);

-- Enable Row Level Security
ALTER TABLE public.project_urls ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view URLs of their team projects
CREATE POLICY "Users can view project urls of their team projects"
  ON public.project_urls
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = project_urls.project_id
      AND tm.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert URLs for their team projects (max 45)
CREATE POLICY "Users can insert project urls for their team projects"
  ON public.project_urls
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = project_urls.project_id
      AND tm.user_id = auth.uid()
    )
    -- Check that project doesn't exceed 45 URLs
    AND (
      SELECT COUNT(*) 
      FROM public.project_urls 
      WHERE project_id = project_urls.project_id
    ) < 45
  );

-- RLS Policy: Users can update URLs of their team projects
CREATE POLICY "Users can update project urls of their team projects"
  ON public.project_urls
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = project_urls.project_id
      AND tm.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete URLs of their team projects
CREATE POLICY "Users can delete project urls of their team projects"
  ON public.project_urls
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = project_urls.project_id
      AND tm.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_project_urls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_project_urls_updated_at
  BEFORE UPDATE ON public.project_urls
  FOR EACH ROW
  EXECUTE FUNCTION update_project_urls_updated_at();
