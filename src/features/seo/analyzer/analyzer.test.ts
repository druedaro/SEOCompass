import { describe, it, expect } from 'vitest';
import { analyzeContent } from './analyzer';
import type { ScrapedContent } from '@/services/contentScraping/contentScrapingService';

describe('SEO Analyzer - Moscow Method Tests', () => {
  const createMockScrapedContent = (html: string, statusCode = 200): ScrapedContent => ({
    html,
    statusCode,
    finalUrl: 'https://example.com/test-page',
    headers: { 'content-type': 'text/html' },
  });

  it('MUST HAVE: should analyze complete HTML and return all required fields', () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>SEO Test Page Title</title>
          <meta name="description" content="This is a comprehensive meta description for testing.">
          <link rel="canonical" href="https://example.com/test-page">
        </head>
        <body>
          <h1>Main Heading</h1>
          <p>Content paragraph with sufficient word count for SEO analysis.</p>
          <img src="/image.jpg" alt="Test image">
        </body>
      </html>
    `;

    const result = analyzeContent(createMockScrapedContent(html));

    expect(result).toHaveProperty('parsedContent');
    expect(result).toHaveProperty('validations');
    expect(result).toHaveProperty('scores');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('h1s');
    expect(result).toHaveProperty('errors');

    expect(result.parsedContent.metadata.title).toBe('SEO Test Page Title');
    expect(result.h1s).toContain('Main Heading');
    expect(result.scores.overall).toBeGreaterThan(0);
    expect(result.scores.overall).toBeLessThanOrEqual(100);
  });

  it('MUST HAVE: should correctly identify and categorize validation results', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Perfect SEO Title Between 30 and 60 Characters</title>
          <meta name="description" content="This is an optimal meta description that falls within the recommended 120-160 character range for search engine results.">
        </head>
        <body>
          <h1>Single H1 Heading</h1>
          <h2>Subheading Level 2</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.</p>
          <img src="/image.jpg" alt="Well described image">
        </body>
      </html>
    `;

    const result = analyzeContent(createMockScrapedContent(html));

    expect(result.validations.titleValidation.isValid).toBe(true);
    expect(result.validations.descriptionValidation.isValid).toBe(true);
    expect(result.validations.h1Validation.isValid).toBe(true);
    expect(result.validations.imagesValidation.isValid).toBe(true);
    expect(result.validations.titleValidation.score).toBeGreaterThan(80);
  });

  it('MUST HAVE: should generate appropriate recommendations based on issues', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Short</title>
        </head>
        <body>
          <h1>First H1</h1>
          <h1>Second H1</h1>
          <p>Very short content.</p>
          <img src="/image.jpg">
        </body>
      </html>
    `;

    const result = analyzeContent(createMockScrapedContent(html));

    expect(result.recommendations.length).toBeGreaterThan(0);

    const hasMetaRecommendation = result.recommendations.some(
      r => r.category === 'meta'
    );
    const hasContentRecommendation = result.recommendations.some(
      r => r.category === 'content'
    );

    expect(hasMetaRecommendation || hasContentRecommendation).toBe(true);

    result.recommendations.forEach(recommendation => {
      expect(recommendation).toHaveProperty('category');
      expect(recommendation).toHaveProperty('priority');
      expect(recommendation).toHaveProperty('title');
      expect(recommendation).toHaveProperty('description');
      expect(recommendation).toHaveProperty('action');
    });
  });
});
