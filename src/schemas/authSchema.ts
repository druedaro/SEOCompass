import { z } from 'zod';
import { ROLE_OPTIONS } from '@/constants/roles';
import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from '@/constants/validation';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED.EMAIL)
    .email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID),
  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED.PASSWORD)
    .min(VALIDATION_LIMITS.PASSWORD_MIN, VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED.FULL_NAME)
    .min(VALIDATION_LIMITS.FULL_NAME_MIN, VALIDATION_MESSAGES.LENGTH.FULL_NAME_MIN)
    .max(VALIDATION_LIMITS.FULL_NAME_MAX, VALIDATION_MESSAGES.LENGTH.FULL_NAME_MAX),
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED.EMAIL)
    .email(VALIDATION_MESSAGES.FORMAT.EMAIL_INVALID),
  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED.PASSWORD)
    .min(VALIDATION_LIMITS.PASSWORD_MIN, VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      VALIDATION_MESSAGES.FORMAT.PASSWORD_COMPLEXITY
    ),
  confirmPassword: z
    .string()
    .min(1, VALIDATION_MESSAGES.MATCH.CONFIRM_PASSWORD),
  role: z.enum(['tech_seo', 'content_seo', 'seo_manager'], {
    message: VALIDATION_MESSAGES.SELECT.ROLE,
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.MATCH.PASSWORD_MISMATCH,
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export { ROLE_OPTIONS as roleOptions };
