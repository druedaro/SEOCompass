import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    mockSupabaseFrom,
    resetSupabaseMocks,
    createSuccessResponse,
    createQueryBuilder,
} from '@/__mocks__/supabase';

vi.mock('@/config/supabase', () => ({
    supabase: {
        from: mockSupabaseFrom,
    },
}));

const {
    getProjectUrls,
    addProjectUrl,
    deleteProjectUrl,
} = await import('@/services/projectUrls/projectUrlsService');

describe('Project URLs Service - Moscow Method Tests', () => {
    beforeEach(() => {
        resetSupabaseMocks();
    });

    it('should get all project URLs successfully', async () => {
        const mockUrls = [
            {
                id: 'url-1',
                project_id: 'project-123',
                url: 'https://example.com/page1',
                label: 'Page 1',
                created_at: '2024-01-01T00:00:00Z',
            },
            {
                id: 'url-2',
                project_id: 'project-123',
                url: 'https://example.com/page2',
                label: 'Page 2',
                created_at: '2024-01-02T00:00:00Z',
            },
        ];

        const queryBuilder = createQueryBuilder();
        queryBuilder.select.mockReturnValue(queryBuilder);
        queryBuilder.eq.mockReturnValue(queryBuilder);
        queryBuilder.order.mockResolvedValue(createSuccessResponse(mockUrls));

        mockSupabaseFrom.mockReturnValue(queryBuilder);

        const result = await getProjectUrls('project-123');

        expect(result).toEqual(mockUrls);
        expect(mockSupabaseFrom).toHaveBeenCalledWith('project_urls');
        expect(queryBuilder.eq).toHaveBeenCalledWith('project_id', 'project-123');
    });

    it('should add a new project URL successfully', async () => {
        const newUrl = {
            project_id: 'project-123',
            url: 'https://example.com/new-page',
            label: 'New Page',
        };

        const mockResponse = {
            id: 'url-new',
            ...newUrl,
            created_at: '2024-01-03T00:00:00Z',
        };

        const queryBuilder = createQueryBuilder();
        queryBuilder.insert.mockReturnValue(queryBuilder);
        queryBuilder.select.mockReturnValue(queryBuilder);
        queryBuilder.single.mockResolvedValue(createSuccessResponse(mockResponse));

        mockSupabaseFrom.mockReturnValue(queryBuilder);

        const result = await addProjectUrl(newUrl);

        expect(result).toEqual(mockResponse);
        expect(mockSupabaseFrom).toHaveBeenCalledWith('project_urls');
        expect(queryBuilder.insert).toHaveBeenCalledWith({
            project_id: newUrl.project_id,
            url: newUrl.url,
            label: newUrl.label,
        });
    });

    it('should delete a project URL successfully', async () => {
        const queryBuilder = createQueryBuilder();
        queryBuilder.delete.mockReturnValue(queryBuilder);
        queryBuilder.eq.mockResolvedValue(createSuccessResponse(null));

        mockSupabaseFrom.mockReturnValue(queryBuilder);

        await deleteProjectUrl('url-123');

        expect(mockSupabaseFrom).toHaveBeenCalledWith('project_urls');
        expect(queryBuilder.delete).toHaveBeenCalled();
        expect(queryBuilder.eq).toHaveBeenCalledWith('id', 'url-123');
    });
});
