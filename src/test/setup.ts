import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockSupabaseClient } from '@/__mocks__/supabase';

vi.mock('@/config/supabase', () => ({
  supabase: mockSupabaseClient,
}));
