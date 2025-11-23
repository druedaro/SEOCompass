import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  resetSupabaseMocks,
} from '@/__mocks__/supabase';

const mockInvoke = vi.hoisted(() => vi.fn());

vi.mock('@/config/supabase', () => ({
  supabase: {
    functions: {
      invoke: mockInvoke,
    },
  },
}));

const { scrapeUrl, checkUrlStatus } =
  await import('@/services/contentScraping/contentScrapingService');

describe('Content Scraping Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
    mockInvoke.mockClear();
  });

  it('should scrape URL successfully', async () => {
    const mockScrapedData = {
      html: '<html><body>Test Content</body></html>',
      status_code: 200,
      final_url: 'https://example.com',
      headers: { 'content-type': 'text/html' },
    };

    mockInvoke.mockResolvedValue({
      data: mockScrapedData,
      error: null,
    });

    const result = await scrapeUrl('https://example.com');

    expect(result).toEqual({
      html: mockScrapedData.html,
      statusCode: 200,
      finalUrl: 'https://example.com',
      headers: mockScrapedData.headers,
    });
  });

  it('should check URL status successfully', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        status_code: 200,
        final_url: 'https://example.com',
        html: '<html></html>' // Added html property as it is required by scrapeUrl
      },
      error: null,
    });

    const result = await checkUrlStatus('https://example.com');

    expect(result.statusCode).toBe(200);
    expect(result.finalUrl).toBe('https://example.com');
  });
});
