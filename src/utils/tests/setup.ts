import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockSupabaseClient } from './__mocks__/supabaseMock';

vi.mock('@/config/supabase', () => ({
  supabase: mockSupabaseClient,
}));
