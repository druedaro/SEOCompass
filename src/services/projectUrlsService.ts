import { supabase } from '@/lib/supabaseClient';

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

/**
 * Get all URLs for a project (max 45)
 */
export async function getProjectUrls(projectId: string): Promise<ProjectUrl[]> {
  const { data, error } = await supabase
    .from('project_urls')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project URLs:', error);
    throw new Error(`Failed to fetch project URLs: ${error.message}`);
  }

  return data || [];
}

/**
 * Add a new URL to a project
 * Will fail if project already has 45 URLs (RLS policy)
 */
export async function addProjectUrl(input: CreateProjectUrlInput): Promise<ProjectUrl> {
  // Validate URL format
  try {
    new URL(input.url);
  } catch (err) {
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
    console.error('Error adding project URL:', error);
    throw new Error(`Failed to add project URL: ${error.message}`);
  }

  return data;
}

/**
 * Delete a URL from a project
 */
export async function deleteProjectUrl(urlId: string): Promise<void> {
  const { error } = await supabase
    .from('project_urls')
    .delete()
    .eq('id', urlId);

  if (error) {
    console.error('Error deleting project URL:', error);
    throw new Error(`Failed to delete project URL: ${error.message}`);
  }
}

/**
 * Update a URL's label
 */
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

  if (error) {
    console.error('Error updating project URL:', error);
    throw new Error(`Failed to update project URL: ${error.message}`);
  }

  return data;
}

/**
 * Get a single project URL by ID
 */
export async function getProjectUrlById(urlId: string): Promise<ProjectUrl | null> {
  const { data, error } = await supabase
    .from('project_urls')
    .select('*')
    .eq('id', urlId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching project URL:', error);
    throw new Error(`Failed to fetch project URL: ${error.message}`);
  }

  return data;
}

/**
 * Check if project can add more URLs (has less than 45)
 */
export async function canAddMoreUrls(projectId: string): Promise<boolean> {
  const urls = await getProjectUrls(projectId);
  return urls.length < 45;
}

/**
 * Get URL count for a project
 */
export async function getProjectUrlCount(projectId: string): Promise<number> {
  const { count, error } = await supabase
    .from('project_urls')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (error) {
    console.error('Error counting project URLs:', error);
    throw new Error(`Failed to count project URLs: ${error.message}`);
  }

  return count || 0;
}
