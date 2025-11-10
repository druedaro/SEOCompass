import { supabase } from '@/config/supabase';

export interface ProjectUrl {
  id: string;
  project_id: string;
  url: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectUrlInput {
  project_id: string;
  url: string;
  label?: string;
}

export async function getProjectUrls(projectId: string): Promise<ProjectUrl[]> {
  const { data, error } = await supabase
    .from('project_urls')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch project URLs: ${error.message}`);
  return data || [];
}

export async function addProjectUrl(input: CreateProjectUrlInput): Promise<ProjectUrl> {
  try {
    new URL(input.url);
  } catch {
    throw new Error('Invalid URL format');
  }

  const { data, error } = await supabase
    .from('project_urls')
    .insert({
      project_id: input.project_id,
      url: input.url,
      label: input.label || null,
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes('duplicate key')) {
      throw new Error('This URL already exists in the project');
    }
    if (error.message.includes('45')) {
      throw new Error('Project URL limit reached (45 URLs maximum)');
    }
    throw new Error(`Failed to add project URL: ${error.message}`);
  }

  return data;
}

export async function deleteProjectUrl(urlId: string): Promise<void> {
  const { error } = await supabase
    .from('project_urls')
    .delete()
    .eq('id', urlId);

  if (error) throw new Error(`Failed to delete project URL: ${error.message}`);
}

export async function updateProjectUrl(
  urlId: string,
  updates: { label?: string; url?: string }
): Promise<ProjectUrl> {
  const { data, error } = await supabase
    .from('project_urls')
    .update(updates)
    .eq('id', urlId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update project URL: ${error.message}`);
  return data;
}

export async function getProjectUrlById(urlId: string): Promise<ProjectUrl | null> {
  const { data, error } = await supabase
    .from('project_urls')
    .select('*')
    .eq('id', urlId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch project URL: ${error.message}`);
  }

  return data;
}

export async function canAddMoreUrls(projectId: string): Promise<boolean> {
  const urls = await getProjectUrls(projectId);
  return urls.length < 45;
}

export async function getProjectUrlCount(projectId: string): Promise<number> {
  const { count, error } = await supabase
    .from('project_urls')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (error) throw new Error(`Failed to count project URLs: ${error.message}`);
  return count || 0;
}
