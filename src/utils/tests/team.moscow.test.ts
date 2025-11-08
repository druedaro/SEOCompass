import { describe, it, expect, beforeEach } from 'vitest';
import { teamService } from '@/services/teamService';
import {
  mockSupabaseAuth,
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createErrorResponse,
  createQueryBuilder,
} from './__mocks__/supabaseMock';

describe('Team Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  describe('MUST HAVE - Core Team Functionality', () => {
    it('should create a new team successfully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockTeam = {
        id: 'team-123',
        name: 'Test Team',
        description: 'A test team',
        user_id: 'user-123',
        created_at: new Date().toISOString(),
      };

      // Mock auth
      mockSupabaseAuth.getUser.mockResolvedValue(
        createSuccessResponse({ user: mockUser })
      );

      // Mock insert with chaining
      const insertBuilder = createQueryBuilder();
      insertBuilder.insert.mockReturnValueOnce(insertBuilder);
      insertBuilder.select.mockReturnValueOnce(insertBuilder);
      insertBuilder.single.mockResolvedValueOnce(
        createSuccessResponse(mockTeam)
      );
      mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

      const result = await teamService.createTeam({
        name: 'Test Team',
        description: 'A test team',
      });

      expect(result).toEqual(mockTeam);
      expect(mockSupabaseAuth.getUser).toHaveBeenCalled();
      expect(insertBuilder.insert).toHaveBeenCalledWith({
        name: 'Test Team',
        description: 'A test team',
        user_id: 'user-123',
      });
    });

    it('should handle team creation error', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseAuth.getUser.mockResolvedValue(
        createSuccessResponse({ user: mockUser })
      );

      const insertBuilder = createQueryBuilder();
      insertBuilder.insert.mockReturnValueOnce(insertBuilder);
      insertBuilder.select.mockReturnValueOnce(insertBuilder);
      insertBuilder.single.mockResolvedValueOnce(
        createErrorResponse('Failed to create team', 'TEAM_CREATE_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

      await expect(
        teamService.createTeam({ name: 'Test Team' })
      ).rejects.toThrow();
    });

    it('should get team by ID successfully', async () => {
      const mockTeam = {
        id: 'team-123',
        name: 'Test Team',
        user_id: 'user-123',
        created_at: new Date().toISOString(),
      };

      const selectBuilder = createQueryBuilder();
      selectBuilder.select.mockReturnValueOnce(selectBuilder);
      selectBuilder.eq.mockReturnValueOnce(selectBuilder);
      selectBuilder.single.mockResolvedValueOnce(
        createSuccessResponse(mockTeam)
      );
      mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

      const result = await teamService.getTeamById('team-123');

      expect(result).toEqual(mockTeam);
      expect(selectBuilder.eq).toHaveBeenCalledWith('id', 'team-123');
    });

    it('should handle get team error', async () => {
      const selectBuilder = createQueryBuilder();
      selectBuilder.select.mockReturnValueOnce(selectBuilder);
      selectBuilder.eq.mockReturnValueOnce(selectBuilder);
      selectBuilder.single.mockResolvedValueOnce(
        createErrorResponse('Team not found', 'TEAM_NOT_FOUND')
      );
      mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

      await expect(teamService.getTeamById('invalid-id')).rejects.toThrow();
    });

    it('should update team successfully', async () => {
      const mockUpdatedTeam = {
        id: 'team-123',
        name: 'Updated Team',
        description: 'Updated description',
        user_id: 'user-123',
        updated_at: new Date().toISOString(),
      };

      const updateBuilder = createQueryBuilder();
      updateBuilder.update.mockReturnValueOnce(updateBuilder);
      updateBuilder.eq.mockReturnValueOnce(updateBuilder);
      updateBuilder.select.mockReturnValueOnce(updateBuilder);
      updateBuilder.single.mockResolvedValueOnce(
        createSuccessResponse(mockUpdatedTeam)
      );
      mockSupabaseFrom.mockReturnValueOnce(updateBuilder);

      const result = await teamService.updateTeam('team-123', {
        name: 'Updated Team',
        description: 'Updated description',
      });

      expect(result).toEqual(mockUpdatedTeam);
      expect(updateBuilder.update).toHaveBeenCalledWith({
        name: 'Updated Team',
        description: 'Updated description',
      });
      expect(updateBuilder.eq).toHaveBeenCalledWith('id', 'team-123');
    });

    it('should handle update team error', async () => {
      const updateBuilder = createQueryBuilder();
      updateBuilder.update.mockReturnValueOnce(updateBuilder);
      updateBuilder.eq.mockReturnValueOnce(updateBuilder);
      updateBuilder.select.mockReturnValueOnce(updateBuilder);
      updateBuilder.single.mockResolvedValueOnce(
        createErrorResponse('Failed to update team', 'TEAM_UPDATE_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(updateBuilder);

      await expect(
        teamService.updateTeam('team-123', { name: 'Updated' })
      ).rejects.toThrow();
    });
  });

  describe('SHOULD HAVE - Team Members Management', () => {
    it('should get team members successfully', async () => {
      const mockMembers = [
        {
          id: 'member-1',
          team_id: 'team-123',
          user_id: 'user-1',
          role: 'tech_seo',
          joined_at: new Date().toISOString(),
        },
        {
          id: 'member-2',
          team_id: 'team-123',
          user_id: 'user-2',
          role: 'content_seo',
          joined_at: new Date().toISOString(),
        },
      ];

      const mockProfile = {
        user_id: 'user-1',
        full_name: 'Test User',
        email: 'test@example.com',
      };

      // Mock team_members query
      const membersBuilder = createQueryBuilder();
      membersBuilder.select.mockReturnValueOnce(membersBuilder);
      membersBuilder.eq.mockReturnValueOnce(membersBuilder);
      membersBuilder.order.mockResolvedValueOnce(
        createSuccessResponse(mockMembers)
      );

      // Mock profile queries
      const profileBuilder1 = createQueryBuilder();
      profileBuilder1.select.mockReturnValue(profileBuilder1);
      profileBuilder1.eq.mockReturnValue(profileBuilder1);
      profileBuilder1.single.mockResolvedValueOnce(createSuccessResponse(mockProfile));

      const profileBuilder2 = createQueryBuilder();
      profileBuilder2.select.mockReturnValue(profileBuilder2);
      profileBuilder2.eq.mockReturnValue(profileBuilder2);
      profileBuilder2.single.mockResolvedValueOnce(createSuccessResponse(mockProfile));

      mockSupabaseFrom
        .mockReturnValueOnce(membersBuilder)
        .mockReturnValueOnce(profileBuilder1)
        .mockReturnValueOnce(profileBuilder2);

      const result = await teamService.getTeamMembers('team-123');

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('profile');
      expect(membersBuilder.eq).toHaveBeenCalledWith('team_id', 'team-123');
    });

    it('should handle get team members error', async () => {
      const membersBuilder = createQueryBuilder();
      membersBuilder.select.mockReturnValueOnce(membersBuilder);
      membersBuilder.eq.mockReturnValueOnce(membersBuilder);
      membersBuilder.order.mockResolvedValueOnce(
        createErrorResponse('Failed to fetch members', 'MEMBERS_FETCH_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(membersBuilder);

      await expect(
        teamService.getTeamMembers('team-123')
      ).rejects.toThrow();
    });
  });

  describe('COULD HAVE - Advanced Team Operations', () => {
    it('should delete team successfully', async () => {
      const deleteBuilder = createQueryBuilder();
      deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
      deleteBuilder.eq.mockResolvedValueOnce(createSuccessResponse(null));
      mockSupabaseFrom.mockReturnValueOnce(deleteBuilder);

      await teamService.deleteTeam('team-123');

      expect(deleteBuilder.delete).toHaveBeenCalled();
      expect(deleteBuilder.eq).toHaveBeenCalledWith('id', 'team-123');
    });

    it('should handle delete team error', async () => {
      const deleteBuilder = createQueryBuilder();
      deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
      deleteBuilder.eq.mockResolvedValueOnce(
        createErrorResponse('Failed to delete team', 'TEAM_DELETE_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(deleteBuilder);

      await expect(teamService.deleteTeam('team-123')).rejects.toThrow();
    });

    it('should update member role successfully', async () => {
      const mockUpdatedMember = {
        id: 'member-1',
        team_id: 'team-123',
        user_id: 'user-1',
        role: 'developer',
        updated_at: new Date().toISOString(),
      };

      const updateBuilder = createQueryBuilder();
      updateBuilder.update.mockReturnValueOnce(updateBuilder);
      updateBuilder.eq
        .mockReturnValueOnce(updateBuilder)
        .mockReturnValueOnce(updateBuilder);
      updateBuilder.select.mockReturnValueOnce(updateBuilder);
      updateBuilder.single.mockResolvedValueOnce(
        createSuccessResponse(mockUpdatedMember)
      );
      mockSupabaseFrom.mockReturnValueOnce(updateBuilder);

      const result = await teamService.updateMemberRole(
        'team-123',
        'user-1',
        'developer'
      );

      expect(result).toEqual(mockUpdatedMember);
      expect(updateBuilder.update).toHaveBeenCalledWith({ role: 'developer' });
    });

    it('should handle update member role error', async () => {
      const updateBuilder = createQueryBuilder();
      updateBuilder.update.mockReturnValueOnce(updateBuilder);
      updateBuilder.eq
        .mockReturnValueOnce(updateBuilder)
        .mockReturnValueOnce(updateBuilder);
      updateBuilder.select.mockReturnValueOnce(updateBuilder);
      updateBuilder.single.mockResolvedValueOnce(
        createErrorResponse('Failed to update role', 'ROLE_UPDATE_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(updateBuilder);

      await expect(
        teamService.updateMemberRole('team-123', 'user-1', 'developer')
      ).rejects.toThrow();
    });
  });
});
