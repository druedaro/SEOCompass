import { describe, it, expect } from 'vitest';
import { parseHTMLContent } from './htmlParser';

describe('HTML Parser - Moscow Method Tests', () => {
  const BASE_URL = 'https://example.com/page';

  it('MUST HAVE: should extract all metadata correctly', () => {
    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <title>Test Page Title</title>
          <meta name="description" content="Test description for SEO">
          <meta name="robots" content="index, follow">
          <meta name="author" content="John Doe">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="canonical" href="https://example.com/canonical">
        </head>
        <body></body>
      </html>
    `;

    const result = parseHTMLContent(html, BASE_URL);

    expect(result.metadata.title).toBe('Test Page Title');
    expect(result.metadata.description).toBe('Test description for SEO');
    expect(result.metadata.robots).toBe('index, follow');
    expect(result.metadata.author).toBe('John Doe');
    expect(result.metadata.viewport).toBe('width=device-width, initial-scale=1');
    expect(result.metadata.canonicalUrl).toBe('https://example.com/canonical');
    expect(result.metadata.language).toBe('es');
  });

  it('MUST HAVE: should extract all headings with hierarchy', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <h1 id="main-heading">Main Heading</h1>
          <h2>Subheading 1</h2>
          <h3>Sub-subheading</h3>
          <h2>Subheading 2</h2>
          <h1>Second H1 (should be avoided)</h1>
        </body>
      </html>
    `;

    const result = parseHTMLContent(html, BASE_URL);

    expect(result.headings).toHaveLength(5);
    expect(result.headings[0]).toEqual({ level: 1, text: 'Main Heading', id: 'main-heading' });
    expect(result.headings[1]).toEqual({ level: 2, text: 'Subheading 1', id: undefined });
    expect(result.headings[2]).toEqual({ level: 3, text: 'Sub-subheading', id: undefined });
    expect(result.headings.filter(h => h.level === 1)).toHaveLength(2);
  });

  it('MUST HAVE: should extract and categorize images correctly', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <img src="/local-image.jpg" alt="Local image description">
          <img src="https://example.com/image.png" alt="">
          <img src="data:image/gif;base64,..." alt="Base64 image">
          <img src="/no-alt.jpg">
        </body>
      </html>
    `;

    const result = parseHTMLContent(html, BASE_URL);

    expect(result.images).toHaveLength(4);
    expect(result.images[0].alt).toBe('Local image description');
    expect(result.images[1].alt).toBe('');
    expect(result.images[2].alt).toBe('Base64 image');
    expect(result.images[3].alt).toBe(null);
    expect(result.images.filter(img => !img.alt).length).toBeGreaterThan(0);
  });
});
