import { describe, it, expect } from 'vitest';
import { generateRecommendations } from './recommendationsEngine';
import type { RecommendationInput } from '@/types/seoTypes';

describe('Recommendations Engine - Moscow Method Tests', () => {
    const createMockValidation = (isValid: boolean, score: number, issues: string[] = [], warnings: string[] = []) => ({
        isValid,
        score,
        issues,
        warnings,
    });

    const createBaseInput = (): RecommendationInput => ({
        titleValidation: createMockValidation(true, 100),
        title: 'Valid Title',
        descriptionValidation: createMockValidation(true, 100),
        description: 'Valid Description',
        urlValidation: createMockValidation(true, 100),
        h1Validation: createMockValidation(true, 100),
        h1s: ['Valid H1'],
        headingHierarchyValidation: createMockValidation(true, 100),
        imagesValidation: createMockValidation(true, 100),
        images: [{ src: '/img.jpg', alt: 'Alt text' }],
        contentLengthValidation: createMockValidation(true, 100),
        wordCount: 500,
        canonicalValidation: createMockValidation(true, 100),
        robotsValidation: createMockValidation(true, 100),
        hasStructuredData: true,
        internalLinks: 5,
        externalLinks: 2,
        has404Error: false,
        hasServerError: false,
    });

    it('MUST HAVE: should generate critical recommendations for HTTP errors', () => {
        const input404 = { ...createBaseInput(), has404Error: true };
        const recs404 = generateRecommendations(input404);

        const error404Rec = recs404.find(r => r.severity === 'critical' && r.title.includes('404'));
        expect(error404Rec).toBeDefined();
        expect(error404Rec?.priority).toBe(10);
        expect(error404Rec?.category).toBe('technical');

        const input5xx = { ...createBaseInput(), hasServerError: true };
        const recs5xx = generateRecommendations(input5xx);

        const error5xxRec = recs5xx.find(r => r.severity === 'critical' && r.title.includes('Server'));
        expect(error5xxRec).toBeDefined();
        expect(error5xxRec?.priority).toBe(10);
    });

    it('MUST HAVE: should generate meta recommendations for title and description issues', () => {
        const input = {
            ...createBaseInput(),
            titleValidation: createMockValidation(false, 50, ['Title too short (15 chars, min: 30)']),
            title: 'Short Title',
            descriptionValidation: createMockValidation(false, 40, ['Description too short (50 chars, min: 120)']),
            description: 'Short description',
        };

        const recommendations = generateRecommendations(input);

        const metaRecs = recommendations.filter(r => r.category === 'meta');
        expect(metaRecs.length).toBeGreaterThan(0);

        const titleRec = metaRecs.find(r => r.title.includes('Title'));
        const descRec = metaRecs.find(r => r.title.includes('Description'));

        expect(titleRec).toBeDefined();
        expect(descRec).toBeDefined();
        expect(titleRec?.severity).toBe('critical');
    });

    it('MUST HAVE: should generate content recommendations for H1 and word count', () => {
        const input = {
            ...createBaseInput(),
            h1Validation: createMockValidation(false, 0, ['No H1 heading found']),
            h1s: [],
            contentLengthValidation: createMockValidation(false, 50, ['Content short (150 words, aim for 300+)']),
            wordCount: 150,
        };

        const recommendations = generateRecommendations(input);

        const contentRecs = recommendations.filter(r => r.category === 'content');
        expect(contentRecs.length).toBeGreaterThan(0);

        const h1Rec = contentRecs.find(r => r.title.includes('H1'));
        const lengthRec = contentRecs.find(r => r.title.includes('Content Length'));

        expect(h1Rec).toBeDefined();
        expect(lengthRec).toBeDefined();
        expect(h1Rec?.severity).toBe('critical');
    });
});
