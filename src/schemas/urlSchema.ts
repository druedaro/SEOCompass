import { z } from 'zod';
import { sanitizedString } from './common';

export const projectUrlSchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL')
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      'URL must start with http:// or https://'
    ),
  label: sanitizedString.pipe(z.string().max(100, 'Label must be less than 100 characters')).optional(),
});


