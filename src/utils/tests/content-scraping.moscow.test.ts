import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createErrorResponse,
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
const { scrapeUrl, checkUrlStatus, scrapeMultipleUrls, getAuditHistory } = 
  await import('@/services/contentScrapingService');

describe('Content Scraping Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
    mockInvoke.mockClear();
  });

  describe('MUST HAVE - Core Scraping Functionality', () => {
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
      expect(mockInvoke).toHaveBeenCalledWith('scrape-serp', {
        body: {
          url: 'https://example.com',
          return_html: true,
          render_js: true,
        },
      });
    });

    it('should handle scraping errors', async () => {
      mockInvoke.mockResolvedValue({
        data: null,
        error: { message: 'Network timeout' },
      });

      await expect(scrapeUrl('https://example.com')).rejects.toThrow(
        'Scraping error: Network timeout'
      );
    });

    it('should handle invalid response from scraping service', async () => {
      mockInvoke.mockResolvedValue({
        data: { status_code: 200 }, // Missing html
        error: null,
      });

      await expect(scrapeUrl('https://example.com')).rejects.toThrow(
        'Invalid response from scraping service'
      );
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

    it('should handle URL status check errors', async () => {
      mockInvoke.mockRejectedValue(
        new Error('Connection failed')
      );

      const result = await checkUrlStatus('https://example.com');

      expect(result).toEqual({
        accessible: false,
        statusCode: 0,
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
  });

  describe('SHOULD HAVE - Multiple URLs Scraping', () => {
    it('should scrape multiple URLs successfully', async () => {
      const mockData1 = {
        html: '<html>Page 1</html>',
        status_code: 200,
        final_url: 'https://example.com/page1',
        headers: {},
      };

      const mockData2 = {
        html: '<html>Page 2</html>',
        status_code: 200,
        final_url: 'https://example.com/page2',
        headers: {},
      };

      mockInvoke
        .mockResolvedValueOnce({ data: mockData1, error: null })
        .mockResolvedValueOnce({ data: mockData2, error: null });

      const results = await scrapeMultipleUrls([
        'https://example.com/page1',
        'https://example.com/page2',
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[0].data?.html).toBe('<html>Page 1</html>');
    });

    it('should handle partial failures in multiple URL scraping', async () => {
      const mockData = {
        html: '<html>Success</html>',
        status_code: 200,
        final_url: 'https://example.com/page1',
        headers: {},
      };

      mockInvoke
        .mockResolvedValueOnce({ data: mockData, error: null })
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Failed to scrape' },
        });

      const results = await scrapeMultipleUrls([
        'https://example.com/page1',
        'https://example.com/page2',
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain('Failed to scrape');
    });
  });

  describe('COULD HAVE - Audit History', () => {
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
        {
          id: 'audit-2',
          created_at: new Date().toISOString(),
          overall_score: 90,
          meta_score: 92,
          content_score: 88,
          technical_score: 89,
          on_page_score: 91,
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
      expect(selectBuilder.eq).toHaveBeenCalledWith(
        'project_url_id',
        'project-url-123'
      );
    });

    it('should handle audit history fetch errors', async () => {
      const selectBuilder = createQueryBuilder();
      selectBuilder.select.mockReturnValueOnce(selectBuilder);
      selectBuilder.eq.mockReturnValueOnce(selectBuilder);
      selectBuilder.order.mockReturnValueOnce(selectBuilder);
      selectBuilder.limit.mockResolvedValueOnce(
        createErrorResponse('Database error', 'DB_ERROR')
      );
      mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

      await expect(getAuditHistory('project-url-123')).rejects.toThrow(
        'Failed to fetch audit history'
      );
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
});
