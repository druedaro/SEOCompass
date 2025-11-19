import { describe, it, expect, beforeEach } from 'vitest';
import { createTeam, getTeamById, deleteTeam } from './teamService';
import {
  mockSupabaseAuth,
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from '@/__mocks__/supabase';

describe('Team Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('should create a new team successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockTeam = {
      id: 'team-123',
      name: 'Test Team',
      description: 'A test team',
      user_id: 'user-123',
      created_at: new Date().toISOString(),
    };

    mockSupabaseAuth.getUser.mockResolvedValue(
      createSuccessResponse({ user: mockUser })
    );

    const insertBuilder = createQueryBuilder();
    insertBuilder.insert.mockReturnValueOnce(insertBuilder);
    insertBuilder.select.mockReturnValueOnce(insertBuilder);
    insertBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockTeam)
    );
    mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

    const result = await createTeam({
      name: 'Test Team',
      description: 'A test team',
    });

    expect(result).toEqual(mockTeam);
    expect(mockSupabaseAuth.getUser).toHaveBeenCalled();
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

    const result = await getTeamById('team-123');

    expect(result).toEqual(mockTeam);
  });

  it('should delete team successfully', async () => {
    mockSupabaseAuth.getUser.mockResolvedValue(
      createSuccessResponse({ user: { id: 'user-123' } })
    );

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.single.mockResolvedValueOnce(
      createSuccessResponse({ user_id: 'user-123' })
    );

    const deleteBuilder = createQueryBuilder();
    deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
    deleteBuilder.eq.mockResolvedValueOnce(createSuccessResponse(null));

    mockSupabaseFrom
      .mockReturnValueOnce(selectBuilder)
      .mockReturnValueOnce(deleteBuilder);

    await deleteTeam('team-123');

    expect(mockSupabaseAuth.getUser).toHaveBeenCalled();
    expect(selectBuilder.select).toHaveBeenCalledWith('user_id');
    expect(deleteBuilder.delete).toHaveBeenCalled();
  });
});
