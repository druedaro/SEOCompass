import { vi } from 'vitest';

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

export const createQueryBuilder = () => {
  const builder: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    neq: vi.fn(),
    is: vi.fn(),
    lt: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    range: vi.fn(),
  };
  
  builder.select.mockReturnValue(builder);
  builder.insert.mockReturnValue(builder);
  builder.update.mockReturnValue(builder);
  builder.delete.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.neq.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  builder.lt.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.limit.mockReturnValue(builder);
  builder.range.mockReturnValue(builder);
  
  return builder;
};

export const mockSupabaseFrom = vi.fn(() => createQueryBuilder());

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: mockSupabaseFrom,
};

export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseAuth).forEach((fn) => {
    if (vi.isMockFunction(fn)) {
      fn.mockClear();
    }
  });
  mockSupabaseFrom.mockClear();
};

export const createSuccessResponse = <T>(data: T) => ({
  data,
  error: null,
});

export const createErrorResponse = (message: string, code?: string) => ({
  data: null,
  error: {
    message,
    code: code || 'ERROR',
    name: 'SupabaseError',
  },
});
