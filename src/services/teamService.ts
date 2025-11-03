import { supabase } from '@/config/supabase';
import type { Team, TeamMember } from '@/types/domain';

export interface CreateTeamData {
  name: string;
  description?: string;
  location?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  location?: string;
}

/**
 * Team Service - Handles all team-related operations
 */
export const teamService = {
  /**
   * Get all teams for the current user
   */
  async getUserTeams(): Promise<Team[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get teams where user is owner or member
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching teams:', error);
      return [];
    }

    return data as Team[];
  },

  /**
   * Get team by ID
   */
  async getTeamById(teamId: string): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new team
   */
  async createTeam(teamData: CreateTeamData): Promise<Team> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...teamData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update team details
   */
  async updateTeam(teamId: string, teamData: UpdateTeamData): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete team
   */
  async deleteTeam(teamId: string): Promise<void> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) throw error;
  },

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    
    // Fetch profile data separately for each member
    if (data && data.length > 0) {
      const membersWithProfiles = await Promise.all(
        data.map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', member.user_id)
            .single();
          
          return {
            ...member,
            profile
          };
        })
      );
      return membersWithProfiles as TeamMember[];
    }
    
    return data as TeamMember[];
  },

  /**
   * Update team member role
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    role: 'tech_seo' | 'content_seo' | 'developer'
  ): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove team member
   */
  async removeMember(teamId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Check if user is team admin
   */
  async isTeamAdmin(teamId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) return false;
    return data.role === 'admin';
  },

  /**
   * Leave team
   */
  async leaveTeam(teamId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user is the owner
    const { data: team } = await supabase
      .from('teams')
      .select('owner_id')
      .eq('id', teamId)
      .single();

    if (team?.owner_id === user.id) {
      throw new Error('Team owner cannot leave. Transfer ownership or delete the team.');
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', user.id);

    if (error) throw error;
  },
};
