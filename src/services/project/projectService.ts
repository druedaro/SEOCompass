import { supabase } from '@/config/supabase';
import type { Project } from '@/types/project';

async function checkProjectOwnership(projectId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: project } = await supabase
    .from('projects')
    .select('team_id')
    .eq('id', projectId)
    .single();

  if (!project) throw new Error('Project not found');

  const { data: team } = await supabase
    .from('teams')
    .select('user_id')
    .eq('id', project.team_id)
    .single();

  if (!team) throw new Error('Team not found');
  if (team.user_id !== user.id) {
    throw new Error('Only the team owner can perform this action');
  }
}

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
  await checkProjectOwnership(projectId);

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}
