import { supabase } from '@/config/supabase';
import type { Project } from '@/types/domain';

export const projectService = {
  async getProjectsByTeam(teamId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  },

  async createProject(
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
  },

  async updateProject(
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
  },

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  },

  subscribeToProjects(
    teamId: string,
    callback: (payload: { eventType: string; new: any; old: any }) => void
  ) {
    return supabase
      .channel(`projects:team_id=eq.${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `team_id=eq.${teamId}`,
        },
        callback
      )
      .subscribe();
  },
};
