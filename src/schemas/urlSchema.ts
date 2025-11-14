import { z } from 'zod';
import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from '@/constants/validation';

export const projectUrlSchema = z.object({
  url: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED.URL)
    .url(VALIDATION_MESSAGES.FORMAT.URL)
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      VALIDATION_MESSAGES.FORMAT.URL_PROTOCOL
    ),
  label: z.string().max(VALIDATION_LIMITS.URL_LABEL_MAX, VALIDATION_MESSAGES.LENGTH.URL_LABEL_MAX).optional(),
});

export type ProjectUrlFormData = z.infer<typeof projectUrlSchema>;
