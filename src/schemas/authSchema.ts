import { z } from 'zod';
import { ROLE_OPTIONS } from '@/constants/roles';

import { sanitizedString } from './common';

export const loginSchema = z.object({
  email: sanitizedString
    .pipe(z.string().min(1, 'Email is required').email('Invalid email format')),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: sanitizedString
    .pipe(
      z.string()
        .min(1, 'Full name is required')
        .min(3, 'Full name must be at least 3 characters')
        .max(100, 'Full name must be less than 100 characters')
    ),
  email: sanitizedString
    .pipe(z.string().min(1, 'Email is required').email('Invalid email format')),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  role: z.enum(['tech_seo', 'content_seo', 'seo_manager'], {
    message: 'Please select a role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export { ROLE_OPTIONS as roleOptions };
