import * as z from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']).default('todo'),
  due_date: z.string().optional(),
  audit_reference: z.string().optional(),
  assigned_to: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
