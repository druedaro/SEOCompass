import { describe, it, expect, beforeEach } from 'vitest';
import { projectService } from '@/services/projectService';
import {
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createErrorResponse,
  createQueryBuilder,
} from './__mocks__/supabaseMock';

describe('Project Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  describe('MUST HAVE - Core Project Functionality', () => {
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
      expect(insertBuilder.insert).toHaveBeenCalledWith({
        team_id: 'team-123',
        name: 'Test Project',
        description: 'A test project',
        domain: 'example.com',
      });
    });

    it('should handle project creation error', async () => {
      const insertBuilder = createQueryBuilder();
      insertBuilder.insert.mockReturnValueOnce(insertBuilder);
      insertBuilder.select.mockReturnValueOnce(insertBuilder);
      insertBuilder.single.mockResolvedValueOnce(
        createErrorResponse('Failed to create project', 'PROJECT_CREATE_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

      await expect(
        projectService.createProject('team-123', 'Test Project')
      ).rejects.toThrow();
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
      expect(selectBuilder.eq).toHaveBeenCalledWith('id', 'project-123');
    });

    it('should handle get project error', async () => {
      const selectBuilder = createQueryBuilder();
      selectBuilder.select.mockReturnValueOnce(selectBuilder);
      selectBuilder.eq.mockReturnValueOnce(selectBuilder);
      selectBuilder.single.mockResolvedValueOnce(
        createErrorResponse('Project not found', 'PROJECT_NOT_FOUND')
      );
      mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

      await expect(
        projectService.getProjectById('invalid-id')
      ).rejects.toThrow();
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
      expect(updateBuilder.update).toHaveBeenCalledWith({
        name: 'Updated Project',
        description: 'Updated description',
      });
    });

    it('should handle update project error', async () => {
      const updateBuilder = createQueryBuilder();
      updateBuilder.update.mockReturnValueOnce(updateBuilder);
      updateBuilder.eq.mockReturnValueOnce(updateBuilder);
      updateBuilder.select.mockReturnValueOnce(updateBuilder);
      updateBuilder.single.mockResolvedValueOnce(
        createErrorResponse('Failed to update project', 'PROJECT_UPDATE_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(updateBuilder);

      await expect(
        projectService.updateProject('project-123', { name: 'Updated' })
      ).rejects.toThrow();
    });
  });

  describe('SHOULD HAVE - Team Projects Management', () => {
    it('should get all projects for a team successfully', async () => {
      const mockProjects = [
        {
          id: 'project-1',
          team_id: 'team-123',
          name: 'Project 1',
          created_at: new Date().toISOString(),
        },
        {
          id: 'project-2',
          team_id: 'team-123',
          name: 'Project 2',
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
      expect(selectBuilder.eq).toHaveBeenCalledWith('team_id', 'team-123');
      expect(selectBuilder.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
    });

    it('should handle get team projects error', async () => {
      const selectBuilder = createQueryBuilder();
      selectBuilder.select.mockReturnValueOnce(selectBuilder);
      selectBuilder.eq.mockReturnValueOnce(selectBuilder);
      selectBuilder.order.mockResolvedValueOnce(
        createErrorResponse('Failed to fetch projects', 'PROJECTS_FETCH_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

      await expect(
        projectService.getProjectsByTeam('team-123')
      ).rejects.toThrow();
    });

    it('should return empty array for team with no projects', async () => {
      const selectBuilder = createQueryBuilder();
      selectBuilder.select.mockReturnValueOnce(selectBuilder);
      selectBuilder.eq.mockReturnValueOnce(selectBuilder);
      selectBuilder.order.mockResolvedValueOnce(
        createSuccessResponse(null) // null data
      );
      mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

      const result = await projectService.getProjectsByTeam('team-123');

      expect(result).toEqual([]);
    });
  });

  describe('COULD HAVE - Advanced Project Operations', () => {
    it('should delete project successfully', async () => {
      const deleteBuilder = createQueryBuilder();
      deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
      deleteBuilder.eq.mockResolvedValueOnce(createSuccessResponse(null));
      mockSupabaseFrom.mockReturnValueOnce(deleteBuilder);

      await projectService.deleteProject('project-123');

      expect(deleteBuilder.delete).toHaveBeenCalled();
      expect(deleteBuilder.eq).toHaveBeenCalledWith('id', 'project-123');
    });

    it('should handle delete project error', async () => {
      const deleteBuilder = createQueryBuilder();
      deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
      deleteBuilder.eq.mockResolvedValueOnce(
        createErrorResponse('Failed to delete project', 'PROJECT_DELETE_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(deleteBuilder);

      await expect(
        projectService.deleteProject('project-123')
      ).rejects.toThrow();
    });

    it('should create project with minimal data', async () => {
      const mockProject = {
        id: 'project-123',
        team_id: 'team-123',
        name: 'Minimal Project',
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
        'Minimal Project'
      );

      expect(result).toEqual(mockProject);
      expect(insertBuilder.insert).toHaveBeenCalledWith({
        team_id: 'team-123',
        name: 'Minimal Project',
        description: undefined,
        domain: undefined,
      });
    });
  });
});
