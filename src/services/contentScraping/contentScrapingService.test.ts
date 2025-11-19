import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from '@/__mocks__/supabase';

const mockInvoke = vi.hoisted(() => vi.fn());

vi.mock('@/config/supabase', () => ({
  supabase: {
    functions: {
      invoke: mockInvoke,
    },
    from: mockSupabaseFrom,
  },
}));

const { scrapeUrl, checkUrlStatus, getAuditHistory } =
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

  it('should get audit history successfully', async () => {
    const mockAudits = [
      {
        id: 'audit-1',
        project_url_id: 'url-123',
        overall_score: 85,
        created_at: new Date().toISOString(),
      },
    ];

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.order.mockReturnValueOnce(selectBuilder);
    selectBuilder.limit.mockResolvedValueOnce(
      createSuccessResponse(mockAudits)
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await getAuditHistory('url-123');

    expect(result).toEqual(mockAudits);
  });
});
