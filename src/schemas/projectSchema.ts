import * as z from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').max(50),
  description: z.string().max(200).optional(),
  domain: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
