import * as z from 'zod';
import { sanitizedString } from './common';

export const createTeamSchema = z.object({
  name: sanitizedString.pipe(z.string().min(3, 'Team name must be at least 3 characters').max(100)),
  description: sanitizedString.pipe(z.string().max(500)).optional(),
  location: sanitizedString.pipe(z.string().max(200)).optional(),
});

export const updateTeamSchema = z.object({
  name: sanitizedString.pipe(z.string().min(3, 'Team name must be at least 3 characters').max(100)).optional(),
  description: sanitizedString.pipe(z.string().max(500)).optional(),
  location: sanitizedString.pipe(z.string().max(200)).optional(),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;
