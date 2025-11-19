import { describe, it, expect } from 'vitest';
import { calculateSEOScore } from './scoreCalculator';
import type { ScoreCalculationInput } from '@/types/seoTypes';

describe('SEO Score Calculator - Moscow Method Tests', () => {
    const createMockValidation = (score: number) => ({
        isValid: score === 100,
        score,
        issues: [],
        warnings: [],
    });

    const createPerfectInput = (): ScoreCalculationInput => ({
        titleValidation: createMockValidation(100),
        descriptionValidation: createMockValidation(100),
        urlValidation: createMockValidation(100),
        h1Validation: createMockValidation(100),
        headingHierarchyValidation: createMockValidation(100),
        imagesValidation: createMockValidation(100),
        contentLengthValidation: createMockValidation(100),
        canonicalValidation: createMockValidation(100),
        linksValidation: createMockValidation(100),
        hreflangValidation: createMockValidation(100),
        robotsValidation: createMockValidation(100),
        hasStructuredData: true,
        internalLinks: 10,
        externalLinks: 5,
    });

    it('MUST HAVE: should calculate perfect score (100) when all validations pass', () => {
        const perfectInput = createPerfectInput();
        const result = calculateSEOScore(perfectInput);

        expect(result.overall).toBe(100);
        expect(result.meta).toBeGreaterThan(95);
        expect(result.content).toBeGreaterThan(95);
        expect(result.technical).toBeGreaterThan(95);
        expect(result.onPage).toBeGreaterThan(95);
    });

    it('MUST HAVE: should calculate scores for all categories correctly', () => {
        const input: ScoreCalculationInput = {
            ...createPerfectInput(),
            titleValidation: createMockValidation(80),
            descriptionValidation: createMockValidation(90),
            urlValidation: createMockValidation(100),
        };

        const result = calculateSEOScore(input);

        expect(result).toHaveProperty('overall');
        expect(result).toHaveProperty('meta');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('technical');
        expect(result).toHaveProperty('onPage');

        expect(result.overall).toBeGreaterThan(0);
        expect(result.overall).toBeLessThanOrEqual(100);
        expect(result.meta).toBeLessThan(100);
    });

    it('MUST HAVE: should penalize poor title and description scores in meta category', () => {
        const poorMetaInput: ScoreCalculationInput = {
            ...createPerfectInput(),
            titleValidation: createMockValidation(30),
            descriptionValidation: createMockValidation(40),
        };

        const result = calculateSEOScore(poorMetaInput);

        expect(result.meta).toBeLessThan(50);
        expect(result.overall).toBeLessThan(90);
    });
});
