import { vi } from 'vitest';

/**
 * Mock Supabase Client
 * Centralized mock for all tests to avoid duplication and ensure consistency
 */
export const mockSupabaseAuth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
};

// Create a chainable query builder mock
export const createQueryBuilder = () => {
  const builder: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    neq: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
  };
  
  // Make methods chainable
  builder.select.mockReturnValue(builder);
  builder.insert.mockReturnValue(builder);
  builder.update.mockReturnValue(builder);
  builder.delete.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.neq.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.limit.mockReturnValue(builder);
  
  return builder;
};

// Mock Supabase from() query builder
export const mockSupabaseFrom = vi.fn(() => createQueryBuilder());

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: mockSupabaseFrom,
};

/**
 * Helper to reset all mocks between tests
 */
export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseAuth).forEach((fn) => {
    if (vi.isMockFunction(fn)) {
      fn.mockClear();
    }
  });
  mockSupabaseFrom.mockClear();
};

/**
 * Helper to create success responses
 */
export const createSuccessResponse = <T>(data: T) => ({
  data,
  error: null,
});

/**
 * Helper to create error responses
 */
export const createErrorResponse = (message: string, code?: string) => ({
  data: null,
  error: {
    message,
    code: code || 'ERROR',
    name: 'SupabaseError',
  },
});
