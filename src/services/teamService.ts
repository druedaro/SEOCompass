import { supabase } from '@/config/supabase';
import type { Team, TeamMember } from '@/types/team';
import type { CreateTeamFormData, UpdateTeamFormData } from '@/schemas/teamSchema';

async function checkTeamOwnership(teamId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: team } = await supabase
    .from('teams')
    .select('user_id')
    .eq('id', teamId)
    .single();

  if (!team) throw new Error('Team not found');
  if (team.user_id !== user.id) {
    throw new Error('Only the team owner can perform this action');
  }
}

export async function getUserTeams(): Promise<Team[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
  return data as Team[];
}

export async function getTeamById(teamId: string): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error) throw error;
  return data;
}

export async function createTeam(teamData: CreateTeamFormData): Promise<Team> {
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
}

export async function updateTeam(teamId: string, teamData: UpdateTeamFormData): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
  return data;
}

export async function deleteTeam(teamId: string): Promise<void> {
    await checkTeamOwnership(teamId);

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

  if (error) throw error;
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    
    if (data && data.length > 0) {
      const membersWithProfiles = await Promise.all(
        data.map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id, full_name, email, avatar_url, role')
            .eq('user_id', member.user_id)
            .single();
          
          return {
            ...member,
            role: profile?.role || 'content_seo',
            profile: profile || undefined
          };
        })
      );
      
      return membersWithProfiles as TeamMember[];
    }
    
  return data as TeamMember[];
}

export async function removeTeamMember(teamId: string, memberId: string): Promise<void> {
    await checkTeamOwnership(teamId);

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('team_id', teamId);

  if (error) throw error;
}

export async function leaveTeam(teamId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', user.id);

  if (error) throw error;
}

export async function isTeamOwner(teamId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: team } = await supabase
    .from('teams')
    .select('user_id')
    .eq('id', teamId)
    .single();

  return team?.user_id === user.id;
}
