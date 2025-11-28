import { supabase } from '@/config/supabase';

export class AuthorizationService {
  private async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('Not authenticated');
    }
    return user;
  }

  async requireTeamOwnership(teamId: string): Promise<void> {
    const user = await this.getCurrentUser();

    const { data: team, error } = await supabase
      .from('teams')
      .select('user_id')
      .eq('id', teamId)
      .single();

    if (error) throw error;
    if (!team) throw new Error('Team not found');
    
    if (team.user_id !== user.id) {
      throw new Error('Only the team owner can perform this action');
    }
  }

  async requireProjectAccess(projectId: string): Promise<void> {
    const user = await this.getCurrentUser();

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('team_id')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;
    if (!project) throw new Error('Project not found');

    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('user_id')
      .eq('id', project.team_id)
      .single();

    if (teamError) throw teamError;
    if (!team) throw new Error('Team not found');
    
    if (team.user_id !== user.id) {
      throw new Error('Only the team owner can perform this action');
    }
  }
}

export const authorizationService = new AuthorizationService();
