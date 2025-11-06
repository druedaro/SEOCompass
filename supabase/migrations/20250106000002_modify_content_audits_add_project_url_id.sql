-- Add project_url_id column to content_audits
ALTER TABLE public.content_audits
ADD COLUMN project_url_id UUID REFERENCES public.project_urls(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_content_audits_project_url_id ON public.content_audits(project_url_id);

-- Note: We keep the 'url' column for backward compatibility during migration
-- In production, you might want to:
-- 1. Migrate existing data from url to project_url_id
-- 2. Then drop the url column: ALTER TABLE public.content_audits DROP COLUMN url;
