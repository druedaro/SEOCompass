import { describe, it, expect, beforeEach } from 'vitest';
import { taskService } from '@/services/taskService';
import type { CreateTaskInput, UpdateTaskInput } from '@/services/taskService';
import {
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from './__mocks__/supabaseMock';

describe('Task Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('should create a new task successfully', async () => {
    const mockTask = {
      id: 'task-123',
      title: 'Fix SEO Issues',
      description: 'Fix meta tags',
      priority: 'high',
      status: 'todo',
      project_id: 'project-123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const insertBuilder = createQueryBuilder();
    insertBuilder.insert.mockReturnValueOnce(insertBuilder);
    insertBuilder.select.mockReturnValueOnce(insertBuilder);
    insertBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockTask)
    );
    mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

    const input: CreateTaskInput = {
      title: 'Fix SEO Issues',
      description: 'Fix meta tags',
      priority: 'high',
      project_id: 'project-123',
    };

    const result = await taskService.createTask(input);

    expect(result).toEqual(mockTask);
  });

  it('should get task by ID successfully', async () => {
    const mockTask = {
      id: 'task-123',
      title: 'Fix SEO Issues',
      status: 'todo',
      project_id: 'project-123',
      created_at: new Date().toISOString(),
    };

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockTask)
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await taskService.getTaskById('task-123');

    expect(result).toEqual(mockTask);
  });

  it('should update task successfully', async () => {
    const mockUpdatedTask = {
      id: 'task-123',
      title: 'Updated Task',
      status: 'in_progress',
      updated_at: new Date().toISOString(),
    };

    const updateBuilder = createQueryBuilder();
    updateBuilder.update.mockReturnValueOnce(updateBuilder);
    updateBuilder.eq.mockReturnValueOnce(updateBuilder);
    updateBuilder.select.mockReturnValueOnce(updateBuilder);
    updateBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockUpdatedTask)
    );
    mockSupabaseFrom.mockReturnValueOnce(updateBuilder);

    const input: UpdateTaskInput = {
      title: 'Updated Task',
      status: 'in_progress',
    };

    const result = await taskService.updateTask('task-123', input);

    expect(result).toEqual(mockUpdatedTask);
  });

  it('should get all tasks for a project successfully', async () => {
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Task 1',
        project_id: 'project-123',
        status: 'todo',
        created_at: new Date().toISOString(),
      },
    ];

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.order.mockResolvedValueOnce(
      createSuccessResponse(mockTasks)
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await taskService.getTasksByProject('project-123');

    expect(result).toEqual(mockTasks);
  });

  it('should delete task successfully', async () => {
    const deleteBuilder = createQueryBuilder();
    deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
    deleteBuilder.eq.mockResolvedValueOnce(createSuccessResponse(null));
    mockSupabaseFrom.mockReturnValueOnce(deleteBuilder);

    await taskService.deleteTask('task-123');

    expect(deleteBuilder.delete).toHaveBeenCalled();
  });
});
