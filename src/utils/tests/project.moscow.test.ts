import { describe, it, expect, beforeEach } from 'vitest';
import { projectService } from '@/services/projectService';
import {
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from './__mocks__/supabaseMock';

describe('Project Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  // 5 tests total - Core project operations
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

    const result = await projectService.createProject(
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

    const result = await projectService.getProjectById('project-123');

    expect(result).toEqual(mockProject);
  });

  it('should update project successfully', async () => {
    const mockUpdatedProject = {
      id: 'project-123',
      team_id: 'team-123',
      name: 'Updated Project',
      description: 'Updated description',
      updated_at: new Date().toISOString(),
    };

    const updateBuilder = createQueryBuilder();
    updateBuilder.update.mockReturnValueOnce(updateBuilder);
    updateBuilder.eq.mockReturnValueOnce(updateBuilder);
    updateBuilder.select.mockReturnValueOnce(updateBuilder);
    updateBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockUpdatedProject)
    );
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder);

    const result = await projectService.updateProject('project-123', {
      name: 'Updated Project',
      description: 'Updated description',
    });

    expect(result).toEqual(mockUpdatedProject);
  });

  it('should get all projects for a team successfully', async () => {
    const mockProjects = [
      {
        id: 'project-1',
        team_id: 'team-123',
        name: 'Project 1',
        created_at: new Date().toISOString(),
      },
    ];

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.order.mockResolvedValueOnce(
      createSuccessResponse(mockProjects)
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await projectService.getProjectsByTeam('team-123');

    expect(result).toEqual(mockProjects);
  });

  it('should delete project successfully', async () => {
    const deleteBuilder = createQueryBuilder();
    deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
    deleteBuilder.eq.mockResolvedValueOnce(createSuccessResponse(null));
    mockSupabaseFrom.mockReturnValueOnce(deleteBuilder);

    await projectService.deleteProject('project-123');

    expect(deleteBuilder.delete).toHaveBeenCalled();
  });
});
