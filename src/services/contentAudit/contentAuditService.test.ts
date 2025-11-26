import { describe, it, expect, beforeEach } from 'vitest';
import { saveAuditResults, getLatestAudit, getAuditHistory } from './contentAuditService';
import {
  mockSupabaseFrom,
  resetSupabaseMocks,
  createSuccessResponse,
  createQueryBuilder,
} from '@/__mocks__/supabase';

describe('Content Audit Service - Moscow Method Tests', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('MUST HAVE: should save audit results successfully', async () => {
    const mockScores = {
      overall: 85,
      meta: 90,
      content: 80,
      technical: 85,
      onPage: 88,
    };

    const mockRecommendations = [
      {
        id: 'rec-1',
        category: 'meta' as const,
        severity: 'warning' as const,
        title: 'Improve meta description',
        description: 'Meta description could be longer',
        action: 'Expand meta description to 150-160 characters',
        priority: 5,
      },
    ];

    const insertBuilder = createQueryBuilder();
    insertBuilder.insert.mockReturnValueOnce(insertBuilder);
    insertBuilder.insert.mockResolvedValueOnce(createSuccessResponse(null));
    mockSupabaseFrom.mockReturnValueOnce(insertBuilder);

    await saveAuditResults(
      'project-123',
      'url-456',
      'https://example.com',
      mockScores,
      mockRecommendations
    );

    expect(insertBuilder.insert).toHaveBeenCalledWith({
      project_id: 'project-123',
      project_url_id: 'url-456',
      url: 'https://example.com',
      overall_score: 85,
      meta_score: 90,
      content_score: 80,
      technical_score: 85,
      on_page_score: 88,
      recommendations: mockRecommendations,
    });
  });

  it('MUST HAVE: should get latest audit successfully', async () => {
    const mockAuditData = {
      url: 'https://example.com',
      created_at: '2025-11-26T10:00:00Z',
      overall_score: 85,
      meta_score: 90,
      content_score: 80,
      technical_score: 85,
      on_page_score: 88,
    };

    const selectBuilder = createQueryBuilder();
    selectBuilder.select.mockReturnValueOnce(selectBuilder);
    selectBuilder.eq.mockReturnValueOnce(selectBuilder);
    selectBuilder.order.mockReturnValueOnce(selectBuilder);
    selectBuilder.limit.mockResolvedValueOnce(
      createSuccessResponse([mockAuditData])
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await getLatestAudit('project-123');

    expect(result).toEqual({
      url: 'https://example.com',
      createdAt: '2025-11-26T10:00:00Z',
      scores: {
        overall: 85,
        content: 80,
        meta: 90,
        onPage: 88,
        technical: 85,
      },
    });
    expect(selectBuilder.eq).toHaveBeenCalledWith('project_id', 'project-123');
    expect(selectBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(selectBuilder.limit).toHaveBeenCalledWith(1);
  });

  it('MUST HAVE: should get audit history successfully', async () => {
    const mockAuditHistory = [
      {
        id: 'audit-1',
        created_at: '2025-11-20T10:00:00Z',
        overall_score: 75,
        meta_score: 80,
        content_score: 70,
        technical_score: 75,
        on_page_score: 78,
        recommendations: [],
      },
      {
        id: 'audit-2',
        created_at: '2025-11-25T10:00:00Z',
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
      createSuccessResponse(mockAuditHistory)
    );
    mockSupabaseFrom.mockReturnValueOnce(selectBuilder);

    const result = await getAuditHistory('url-456');

    expect(result).toEqual(mockAuditHistory);
    expect(selectBuilder.eq).toHaveBeenCalledWith('project_url_id', 'url-456');
    expect(selectBuilder.order).toHaveBeenCalledWith('created_at', { ascending: true });
    expect(selectBuilder.limit).toHaveBeenCalledWith(30);
  });
});
