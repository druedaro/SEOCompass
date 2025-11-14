import * as z from 'zod';
import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from '@/constants/validation';

export const createTeamSchema = z.object({
  name: z.string().min(VALIDATION_LIMITS.NAME_MIN, VALIDATION_MESSAGES.LENGTH.NAME_MIN('Team')).max(VALIDATION_LIMITS.NAME_MAX),
  description: z.string().max(VALIDATION_LIMITS.DESCRIPTION_MAX).optional(),
  location: z.string().max(VALIDATION_LIMITS.LOCATION_MAX).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(VALIDATION_LIMITS.NAME_MIN, VALIDATION_MESSAGES.LENGTH.NAME_MIN('Team')).max(VALIDATION_LIMITS.NAME_MAX),
  description: z.string().max(VALIDATION_LIMITS.DESCRIPTION_MAX).optional(),
  location: z.string().max(VALIDATION_LIMITS.LOCATION_MAX).optional(),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;
