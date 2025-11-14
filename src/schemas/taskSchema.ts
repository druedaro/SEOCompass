import * as z from 'zod';
import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from '@/constants/validation';

export const taskSchema = z.object({
  title: z.string().min(1, VALIDATION_MESSAGES.REQUIRED.TITLE).max(VALIDATION_LIMITS.TASK_TITLE_MAX, VALIDATION_MESSAGES.LENGTH.TASK_TITLE_MAX),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']).default('todo'),
  due_date: z.string().optional(),
  audit_reference: z.string().optional(),
  assigned_to: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
