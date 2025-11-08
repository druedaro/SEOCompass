import { supabase } from '@/config/supabase';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  project_id: string;
  audit_reference: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string;
  project_id: string;
  audit_reference?: string;
  assigned_to?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string;
  audit_reference?: string;
  assigned_to?: string;
}

export const taskService = {
  /**
   * Get all tasks for a project
   */
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput): Promise<Task> {
    const taskData: any = {
      title: input.title,
      description: input.description || null,
      priority: input.priority || 'medium',
      status: input.status || 'todo',
      project_id: input.project_id,
    };

    // Add optional fields only if they exist
    if (input.due_date) {
      taskData.due_date = input.due_date;
    }

    if (input.audit_reference) {
      taskData.audit_reference = input.audit_reference;
    }

    if (input.assigned_to) {
      taskData.assigned_to = input.assigned_to;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a task
   */
  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    // Convert undefined assigned_to to null for proper database update
    const updateData: any = { ...input };
    if ('assigned_to' in input && input.assigned_to === undefined) {
      updateData.assigned_to = null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  /**
   * Get tasks by status
   */
  async getTasksByStatus(
    projectId: string,
    status: TaskStatus
  ): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks by status:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(projectId: string): Promise<Task[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .lt('due_date', now)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Mark task as completed
   */
  async completeTask(taskId: string): Promise<Task> {
    return this.updateTask(taskId, { status: 'completed' });
  },

  /**
   * Mark task as in progress
   */
  async startTask(taskId: string): Promise<Task> {
    return this.updateTask(taskId, { status: 'in_progress' });
  },
};
