export const AUTH_PATHS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CALLBACK: '/auth/callback',
} as const;

export const APP_PATHS = {
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  CREATE_TEAM: '/teams/create',
  TEAM_SETTINGS: '/teams/:teamId/settings',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:projectId',
  PROJECT_OVERVIEW: '/projects/:projectId',
  CONTENT_ANALYZER: '/projects/:projectId/content',
  PROJECT_URLS_MANAGEMENT: '/projects/:projectId/urls',
  URL_DETAILS: '/projects/:projectId/urls/:urlId',
  ACTION_CENTER: '/projects/:projectId/actions',
  PROJECT_SETTINGS: '/projects/:projectId/settings',
} as const;

export const PUBLIC_PATHS = {
  HOME: '/',
  WELCOME: '/welcome',
} as const;
