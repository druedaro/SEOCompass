import { supabase } from '@/config/supabase';
import type { Project } from '@/types/project';
import { authorizationService } from '@/services/auth/authorizationService';

export async function getProjectsByTeam(teamId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
  return data || [];
}

export async function getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
  return data;
}

export async function createProject(
    teamId: string,
    name: string,
    description?: string,
    domain?: string
  ): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        team_id: teamId,
        name,
        description,
        domain,
      })
      .select()
      .single();

    if (error) throw error;
  return data;
}

export async function updateProject(
    projectId: string,
    updates: { name?: string; description?: string; domain?: string }
  ): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
  return data;
}

export async function deleteProject(projectId: string): Promise<void> {
  await authorizationService.requireProjectAccess(projectId);

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}
