import { supabase } from '@/lib/supabaseClient';
import type { Team, TeamMember, Invitation } from '@/types/domain';

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

export interface InviteMemberData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
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

    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members!inner(role)
      `)
      .eq('team_members.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
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
        owner_id: user.id,
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
      .select(`
        *,
        profiles:user_id(*)
      `)
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data as TeamMember[];
  },

  /**
   * Update team member role
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    role: 'admin' | 'member' | 'viewer'
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
   * Invite member to team
   */
  async inviteMember(teamId: string, inviteData: InviteMemberData): Promise<Invitation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        team_id: teamId,
        email: inviteData.email,
        role: inviteData.role,
        invited_by: user.id,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get pending invitations for a team
   */
  async getTeamInvitations(teamId: string): Promise<Invitation[]> {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get user's pending invitations
   */
  async getUserInvitations(): Promise<Invitation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    const { data, error } = await supabase
      .from('invitations')
      .select(`
        *,
        teams:team_id(name)
      `)
      .eq('email', profile.email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Invitation[];
  },

  /**
   * Accept invitation
   */
  async acceptInvitation(invitationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (inviteError) throw inviteError;
    if (!invitation) throw new Error('Invitation not found');

    // Add user to team
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role,
      });

    if (memberError) throw memberError;

    // Update invitation status
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ status: 'accepted' })
      .eq('id', invitationId);

    if (updateError) throw updateError;
  },

  /**
   * Decline invitation
   */
  async declineInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('invitations')
      .update({ status: 'declined' })
      .eq('id', invitationId);

    if (error) throw error;
  },

  /**
   * Cancel invitation (for team admins)
   */
  async cancelInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId);

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
