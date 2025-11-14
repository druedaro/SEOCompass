import * as z from 'zod';
import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from '@/constants/validation';

export const projectSchema = z.object({
  name: z.string().min(VALIDATION_LIMITS.NAME_MIN, VALIDATION_MESSAGES.LENGTH.NAME_MIN('Project')).max(VALIDATION_LIMITS.NAME_MAX),
  description: z.string().max(VALIDATION_LIMITS.DESCRIPTION_MAX).optional(),
  domain: z.string().url(VALIDATION_MESSAGES.FORMAT.URL).or(z.literal('')).optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
