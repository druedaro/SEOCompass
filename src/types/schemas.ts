import { z } from 'zod';
import { projectUrlSchema } from '@/schemas/urlSchema';
import { taskSchema } from '@/schemas/taskSchema';
import { loginSchema, registerSchema } from '@/schemas/authSchema';
import { projectSchema } from '@/schemas/projectSchema';
import { createTeamSchema, updateTeamSchema } from '@/schemas/teamSchema';

export type ProjectUrlFormData = z.infer<typeof projectUrlSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;
