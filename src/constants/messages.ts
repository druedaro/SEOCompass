// HTTP Status codes and error messages
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_MESSAGES = {
  // Auth
  AUTH_FAILED: 'Authentication failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'This email address is already registered. Would you like to log in?',
  NOT_AUTHENTICATED: 'Not authenticated',
  
  // Teams
  TEAM_NOT_FOUND: 'Team not found',
  TEAM_LOAD_FAILED: 'Failed to load teams',
  TEAM_CREATE_FAILED: 'Failed to create team',
  TEAM_UPDATE_FAILED: 'Failed to update team',
  TEAM_DELETE_FAILED: 'Failed to delete team',
  TEAM_LEAVE_FAILED: 'Failed to leave team',
  NOT_TEAM_OWNER: 'Only the team owner can perform this action',
  NO_TEAM_SELECTED: 'No team selected',
  
  // Projects
  PROJECT_LOAD_FAILED: 'Failed to load projects',
  PROJECT_CREATE_FAILED: 'Failed to create project',
  PROJECT_UPDATE_FAILED: 'Failed to update project',
  PROJECT_DELETE_FAILED: 'Failed to delete project',
  
  // Members
  MEMBERS_LOAD_FAILED: 'Failed to load team members',
  MEMBER_REMOVE_FAILED: 'Failed to remove team member',
  
  // Generic
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  PERMISSION_DENIED: 'You don\'t have permission to perform this action',
} as const;

export const SUCCESS_MESSAGES = {
  // Auth
  ACCOUNT_CREATED: 'Account created! Check your email to confirm your account before logging in.',
  
  // Teams
  TEAM_CREATED: 'Team created successfully',
  TEAM_UPDATED: 'Team updated successfully',
  TEAM_DELETED: 'Team deleted successfully',
  TEAM_LEFT: 'You have left the team',
  
  // Projects
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_DELETED: 'Project deleted successfully',
  
  // Members
  MEMBER_REMOVED: 'Team member removed successfully',
  
  // Tasks
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
} as const;
