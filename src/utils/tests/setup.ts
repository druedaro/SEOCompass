import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockSupabaseClient } from './__mocks__/supabaseMock';

// Mock Supabase globally for all tests before any imports
vi.mock('@/config/supabase', () => ({
  supabase: mockSupabaseClient,
}));
