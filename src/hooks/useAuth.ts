import { createContextHook } from '@/lib/contextFactory';
import { AuthContext } from '@/auth/AuthContext';

export const useAuth = createContextHook(AuthContext, 'useAuth', 'AuthProvider');
