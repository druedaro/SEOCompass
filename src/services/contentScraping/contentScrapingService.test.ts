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

  it('MUST HAVE: should scrape URL successfully', async () => {
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

  it('MUST HAVE: should handle scraping errors correctly', async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: { message: 'Scraping service unavailable' },
    });

    await expect(scrapeUrl('https://example.com')).rejects.toThrow('Scraping error: Scraping service unavailable');
  });

  it('MUST HAVE: should check URL status and detect redirects', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        status_code: 200,
        final_url: 'https://example.com/redirected',
        html: '<html></html>',
        headers: {},
      },
      error: null,
    });

    const result = await checkUrlStatus('https://example.com');

    expect(result.statusCode).toBe(200);
    expect(result.accessible).toBe(true);
    expect(result.redirected).toBe(true);
    expect(result.finalUrl).toBe('https://example.com/redirected');
  });
});
