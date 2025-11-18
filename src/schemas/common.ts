import { z } from 'zod';
import { sanitize } from '@/lib/sanitize';

export const sanitizedString = z.string().transform((val) => sanitize(val) as string);
