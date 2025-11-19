import { describe, it, expect, beforeEach } from 'vitest';
import { createTask, getTaskById, deleteTask } from './taskService';
import {
  mockSupabaseAuth,
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from '@/__mocks__/supabase';

describe('Task Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('should create a new task successfully', async () => {
    const mockTask = {
      id: 'task-123',
      project_id: 'project-123',
      title: 'Test Task',
      description: 'A test task',
      status: 'pending',
      priority: 'medium',
      created_at: new Date().toISOString(),
    };

    const insertBuilder = createQueryBuilder();
    insertBuilder.insert.mockReturnValueOnce(insertBuilder);
    insertBuilder.select.mockReturnValueOnce(insertBuilder);
    insertBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockTask)
    );
    mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

    const result = await createTask({
      project_id: 'project-123',
      title: 'Test Task',
      description: 'A test task',
      status: 'pending',
      priority: 'medium',
    });

    expect(result).toEqual(mockTask);
  });

  it('should get task by ID successfully', async () => {
    const mockTask = {
      id: 'task-123',
      project_id: 'project-123',
      title: 'Test Task',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.single.mockResolvedValueOnce(
      createSuccessResponse(mockTask)
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await getTaskById('task-123');

    expect(result).toEqual(mockTask);
  });

  it('should delete task successfully', async () => {
    const deleteBuilder = createQueryBuilder();
    deleteBuilder.delete.mockReturnValueOnce(deleteBuilder);
    deleteBuilder.eq.mockResolvedValueOnce(createSuccessResponse(null));

    mockSupabaseFrom.mockReturnValueOnce(deleteBuilder);

    await deleteTask('task-123');

    expect(deleteBuilder.delete).toHaveBeenCalled();
    expect(deleteBuilder.eq).toHaveBeenCalledWith('id', 'task-123');
  });
});
