import { supabase } from '@/config/supabase';
import type { Invitation } from '@/types/domain';

export interface InviteMemberData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

/**
 * Invitation Service - Handles team invitation operations
 */
export const invitationService = {
  /**
   * Get pending invitations for current user
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

    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (inviteError) throw inviteError;
    if (!invitation) throw new Error('Invitation not found');

    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role,
      });

    if (memberError) throw memberError;

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
};
