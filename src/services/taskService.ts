import { supabase } from '@/config/supabase';
import { TASKS_PER_PAGE } from '@/constants/tasks';

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

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string | null;
  overdue?: boolean;
}

export interface PaginatedTasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getTasksByProject(
    projectId: string,
    filters?: TaskFilters,
    page: number = 1
  ): Promise<PaginatedTasksResponse> {
    const from = (page - 1) * TASKS_PER_PAGE;
    const to = from + TASKS_PER_PAGE - 1;

    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('project_id', projectId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.assigned_to !== undefined) {
      if (filters.assigned_to === null) {
        query = query.is('assigned_to', null);
      } else {
        query = query.eq('assigned_to', filters.assigned_to);
      }
    }
    if (filters?.overdue) {
      const now = new Date().toISOString();
      query = query
        .lt('due_date', now)
        .neq('status', 'completed');
    }

    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / TASKS_PER_PAGE);

    return {
      tasks: data || [],
      total,
      page,
      pageSize: TASKS_PER_PAGE,
      totalPages,
  };
}

export async function getTaskById(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) throw error;
  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
    interface TaskInsertData {
      title: string;
      description: string | null;
      priority: TaskPriority;
      status: TaskStatus;
      project_id: string;
      due_date?: string;
      audit_reference?: string;
      assigned_to?: string;
    }

    const taskData: TaskInsertData = {
      title: input.title,
      description: input.description || null,
      priority: input.priority || 'medium',
      status: input.status || 'todo',
      project_id: input.project_id,
    };

    if (input.due_date) taskData.due_date = input.due_date;
    if (input.audit_reference) taskData.audit_reference = input.audit_reference;
    if (input.assigned_to) taskData.assigned_to = input.assigned_to;

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
  return data;
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    const updateData: Record<string, string | null | undefined> = { ...input };
    if ('assigned_to' in input && input.assigned_to === undefined) {
      updateData.assigned_to = null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
  return data;
}

export async function deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}

export async function completeTask(taskId: string): Promise<Task> {
  return updateTask(taskId, { status: 'completed' });
}

export async function startTask(taskId: string): Promise<Task> {
  return updateTask(taskId, { status: 'in_progress' });
}
