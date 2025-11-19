import { describe, it, expect, beforeEach } from 'vitest';
import { createProject, getProjectById, deleteProject } from './projectService';
import {
  mockSupabaseAuth,
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from '@/__mocks__/supabase';

describe('Project Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('should create a new project successfully', async () => {
    const mockProject = {
      id: 'project-123',
      team_id: 'team-123',
      name: 'Test Project',
      description: 'A test project',
      domain: 'example.com',
      created_at: new Date().toISOString(),
    };

    const insertBuilder = createQueryBuilder();
    insertBuilder.insert.mockReturnValueOnce(insertBuilder);
    insertBuilder.select.mockReturnValueOnce(insertBuilder);
    insertBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockProject)
    );
    mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

    const result = await createProject(
      'team-123',
      'Test Project',
      'A test project',
      'example.com'
    );

    expect(result).toEqual(mockProject);
  });

  it('should get project by ID successfully', async () => {
    const mockProject = {
      id: 'project-123',
      team_id: 'team-123',
      name: 'Test Project',
      created_at: new Date().toISOString(),
    };

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockProject)
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await getProjectById('project-123');

    expect(result).toEqual(mockProject);
  });

  it('should delete project successfully', async () => {
    mockSupabaseAuth.getUser.mockResolvedValue(
      createSuccessResponse({ user: { id: 'user-123' } })
    );

    const selectProjectBuilder = createQueryBuilder();
    selectProjectBuilder.select.mockReturnValueOnce(selectProjectBuilder);
    selectProjectBuilder.eq.mockReturnValueOnce(selectProjectBuilder);
    selectProjectBuilder.single.mockResolvedValueOnce(
      createSuccessResponse({ team_id: 'team-123' })
    );

    const selectTeamBuilder = createQueryBuilder();
    selectTeamBuilder.select.mockReturnValueOnce(selectTeamBuilder);
    selectTeamBuilder.eq.mockReturnValueOnce(selectTeamBuilder);
    selectTeamBuilder.single.mockResolvedValueOnce(
      createSuccessResponse({ user_id: 'user-123' })
    );

    const deleteBuilder = createQueryBuilder();
    deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
    deleteBuilder.eq.mockResolvedValueOnce(createSuccessResponse(null));

    mockSupabaseFrom
      .mockReturnValueOnce(selectProjectBuilder)
      .mockReturnValueOnce(selectTeamBuilder)
      .mockReturnValueOnce(deleteBuilder);

    await deleteProject('project-123');

    expect(mockSupabaseAuth.getUser).toHaveBeenCalled();
    expect(selectProjectBuilder.select).toHaveBeenCalledWith('team_id');
    expect(selectTeamBuilder.select).toHaveBeenCalledWith('user_id');
    expect(deleteBuilder.delete).toHaveBeenCalled();
  });
});
