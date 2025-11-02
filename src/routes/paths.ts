// Auth routes
export const AUTH_PATHS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CALLBACK: '/auth/callback',
} as const;

// App routes
export const APP_PATHS = {
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  CREATE_TEAM: '/teams/create',
  TEAM_SETTINGS: '/teams/:teamId/settings',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:projectId',
  KEYWORD_TRACKER: '/projects/:projectId/keywords',
  CONTENT_ANALYZER: '/projects/:projectId/content',
  TECHNICAL_AUDIT: '/projects/:projectId/technical',
  ACTION_CENTER: '/projects/:projectId/actions',
} as const;

// Public routes
export const PUBLIC_PATHS = {
  HOME: '/',
  WELCOME: '/welcome',
} as const;
