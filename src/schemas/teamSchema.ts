import * as z from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(100).optional(),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;
