import { supabase } from '@/config/supabase';
import type { Project } from '@/types/domain';

export const projectService = {
  /**
   * Get all projects for a specific team
   */
  async getProjectsByTeam(teamId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single project by ID
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new project
   */
  async createProject(
    teamId: string,
    name: string,
    description?: string
  ): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        team_id: teamId,
        name,
        description,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing project
   */
  async updateProject(
    projectId: string,
    updates: { name?: string; description?: string }
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

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  },

  /**
   * Subscribe to real-time changes for team projects
   */
  subscribeToProjects(
    teamId: string,
    callback: (payload: any) => void
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
