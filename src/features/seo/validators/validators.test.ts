import { describe, it, expect } from 'vitest';
import {
    validateTitle,
    validateDescription,
    validateUrl,
} from './validators';

describe('SEO Validators - Moscow Method Tests', () => {

    it('MUST HAVE: should validate title tag correctly', () => {
        const validTitle = validateTitle('Perfect SEO Title Between 30-60 Chars');
        expect(validTitle.isValid).toBe(true);
        expect(validTitle.score).toBeGreaterThan(80);
        expect(validTitle.issues).toHaveLength(0);

        const missingTitle = validateTitle(null);
        expect(missingTitle.isValid).toBe(false);
        expect(missingTitle.score).toBe(0);
        expect(missingTitle.issues.length).toBeGreaterThan(0);

        const tooShortTitle = validateTitle('Short');
        expect(tooShortTitle.isValid).toBe(false);
        expect(tooShortTitle.score).toBeLessThan(100);
        expect(tooShortTitle.issues.some(issue => issue.includes('short'))).toBe(true);

        const tooLongTitle = validateTitle('This is an extremely long title that exceeds the recommended 60 character limit for SEO optimization');
        expect(tooLongTitle.isValid).toBe(false);
        expect(tooLongTitle.issues.some(issue => issue.includes('long'))).toBe(true);

        const genericTitle = validateTitle('Home');
        expect(genericTitle.warnings.some(w => w.includes('generic'))).toBe(true);
    });

    it('MUST HAVE: should validate meta description correctly', () => {
        const validDesc = validateDescription(
            'This is a perfect meta description that falls within the optimal range of 120-160 characters for search engine results pages and provides value.'
        );
        expect(validDesc.isValid).toBe(true);
        expect(validDesc.score).toBeGreaterThan(80);
        expect(validDesc.issues).toHaveLength(0);

        const missingDesc = validateDescription(null);
        expect(missingDesc.isValid).toBe(false);
        expect(missingDesc.score).toBe(0);
        expect(missingDesc.issues.length).toBeGreaterThan(0);

        const tooShortDesc = validateDescription('Too short description');
        expect(tooShortDesc.isValid).toBe(false);
        expect(tooShortDesc.score).toBeLessThan(100);
        expect(tooShortDesc.issues.some(issue => issue.includes('short'))).toBe(true);

        const tooLongDesc = validateDescription(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam laboris tempus.'
        );
        expect(tooLongDesc.isValid).toBe(false);
        expect(tooLongDesc.issues.some(issue => issue.includes('long'))).toBe(true);
    });

    it('MUST HAVE: should validate URL structure correctly', () => {
        const validUrl = validateUrl('https://example.com/seo-friendly-url');
        expect(validUrl.isValid).toBe(true);
        expect(validUrl.score).toBe(100);
        expect(validUrl.issues).toHaveLength(0);

        const urlWithQueryParams = validateUrl('https://example.com/page?id=123&ref=google');
        expect(urlWithQueryParams.warnings.some(w => w.includes('query'))).toBe(true);
        expect(urlWithQueryParams.score).toBeLessThan(100);

        const urlWithUnderscores = validateUrl('https://example.com/bad_url_format');
        expect(urlWithUnderscores.warnings.some(w => w.includes('underscores'))).toBe(true);

        const urlWithUppercase = validateUrl('https://example.com/BadURL');
        expect(urlWithUppercase.warnings.some(w => w.includes('uppercase'))).toBe(true);

        const invalidUrl = validateUrl('not-a-valid-url');
        expect(invalidUrl.isValid).toBe(false);
        expect(invalidUrl.issues.length).toBeGreaterThan(0);
    });
});
