-- Fix infinite recursion in INSERT policy for project_urls
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can insert project urls for their team projects" ON public.project_urls;

-- Recreate INSERT policy without the COUNT check (we'll enforce limit in app layer)
CREATE POLICY "Users can insert project urls for their team projects"
  ON public.project_urls
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      INNER JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = project_id
      AND tm.user_id = auth.uid()
    )
  );
