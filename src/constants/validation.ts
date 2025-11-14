// Validation limits used across schemas
export const VALIDATION_LIMITS = {
  // Auth
  PASSWORD_MIN: 6,
  FULL_NAME_MIN: 2,
  FULL_NAME_MAX: 100,
  
  // Projects & Teams
  NAME_MIN: 3,
  NAME_MAX: 50,
  DESCRIPTION_MAX: 200,
  LOCATION_MAX: 100,
  
  // Tasks
  TASK_TITLE_MAX: 200,
  
  // URLs
  URL_LABEL_MAX: 100,
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: {
    EMAIL: 'Email is required',
    PASSWORD: 'Password is required',
    FULL_NAME: 'Full name is required',
    TITLE: 'Title is required',
    URL: 'URL is required',
  },
  LENGTH: {
    PASSWORD_MIN: 'Password must be at least 6 characters',
    FULL_NAME_MIN: 'Full name must be at least 2 characters',
    FULL_NAME_MAX: 'Full name must be less than 100 characters',
    NAME_MIN: (type: string) => `${type} name must be at least 3 characters`,
    TASK_TITLE_MAX: 'Title is too long',
    URL_LABEL_MAX: 'Label must be less than 100 characters',
  },
  FORMAT: {
    EMAIL_INVALID: 'Invalid email format',
    PASSWORD_COMPLEXITY: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    URL: 'Please enter a valid URL',
    URL_PROTOCOL: 'URL must start with http:// or https://',
  },
  MATCH: {
    PASSWORD_MISMATCH: "Passwords don't match",
    CONFIRM_PASSWORD: 'Please confirm your password',
  },
  SELECT: {
    ROLE: 'Please select a role',
  },
} as const;
