import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from './__mocks__/supabaseMock';

// Mock supabase functions - must be hoisted
const mockInvoke = vi.hoisted(() => vi.fn());

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    functions: {
      invoke: mockInvoke,
    },
    from: mockSupabaseFrom,
  },
}));

// Import after mock is set up
const { scrapeUrl, checkUrlStatus, getAuditHistory } = 
  await import('@/services/contentScrapingService');

describe('Content Scraping Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
    mockInvoke.mockClear();
  });

  // 5 tests total - Core scraping operations
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
    const mockScrapedData = {
      html: '<html></html>',
      status_code: 200,
      final_url: 'https://example.com',
      headers: {},
    };

    mockInvoke.mockResolvedValue({
      data: mockScrapedData,
      error: null,
    });

    const result = await checkUrlStatus('https://example.com');

    expect(result).toEqual({
      accessible: true,
      statusCode: 200,
      redirected: false,
      finalUrl: 'https://example.com',
    });
  });

  it('should detect URL redirects', async () => {
    const mockScrapedData = {
      html: '<html></html>',
      status_code: 200,
      final_url: 'https://example.com/new-page',
      headers: {},
    };

    mockInvoke.mockResolvedValue({
      data: mockScrapedData,
      error: null,
    });

    const result = await checkUrlStatus('https://example.com/old-page');

    expect(result.redirected).toBe(true);
    expect(result.finalUrl).toBe('https://example.com/new-page');
  });

  it('should get audit history successfully', async () => {
    const mockAudits = [
      {
        id: 'audit-1',
        created_at: new Date().toISOString(),
        overall_score: 85,
        meta_score: 90,
        content_score: 80,
        technical_score: 85,
        on_page_score: 88,
        recommendations: [],
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

    const result = await getAuditHistory('project-url-123');

    expect(result).toEqual(mockAudits);
  });

  it('should return empty array for no audit history', async () => {
    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.order.mockReturnValueOnce(selectBuilder);
    selectBuilder.limit.mockResolvedValueOnce(createSuccessResponse(null));
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await getAuditHistory('project-url-123');

    expect(result).toEqual([]);
  });
});
