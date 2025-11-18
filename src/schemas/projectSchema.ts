import * as z from 'zod';
import { sanitizedString } from './common';

export const projectSchema = z.object({
  name: sanitizedString.pipe(z.string().min(3, 'Project name must be at least 3 characters').max(100)),
  description: sanitizedString.pipe(z.string().max(500)).optional(),
  domain: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
