/**
 * HTML Parser Utilities for SEO Content Analysis
 * Extracts meta tags, headings, images, links, and structured data
 */

export interface ParsedMetadata {
  title: string | null;
  description: string | null;
  keywords: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  author: string | null;
  language: string | null;
  viewport: string | null;
}

export interface ParsedHeading {
  level: number;
  text: string;
  id?: string;
}

export interface ParsedImage {
  src: string;
  alt: string | null;
  title: string | null;
  width?: number;
  height?: number;
}

export interface ParsedLink {
  href: string;
  text: string;
  rel: string | null;
  target: string | null;
  isInternal: boolean;
  isExternal: boolean;
}

export interface ParsedContent {
  metadata: ParsedMetadata;
  headings: ParsedHeading[];
  images: ParsedImage[];
  links: ParsedLink[];
  hreflangTags: Array<{ hreflang: string; href: string }>;
  bodyText: string;
  wordCount: number;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
}

/**
 * Parse HTML string into a DOM document
 */
function parseHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

/**
 * Extract metadata from HTML document
 */
export function extractMetadata(doc: Document): ParsedMetadata {
  const getMetaContent = (selector: string): string | null => {
    const element = doc.querySelector(selector);
    return element?.getAttribute('content') || null;
  };

  return {
    title: doc.querySelector('title')?.textContent || null,
    description: getMetaContent('meta[name="description"]'),
    keywords: getMetaContent('meta[name="keywords"]'),
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    robots: getMetaContent('meta[name="robots"]'),
    author: getMetaContent('meta[name="author"]'),
    language: doc.documentElement.getAttribute('lang') || null,
    viewport: getMetaContent('meta[name="viewport"]'),
  };
}

/**
 * Extract all headings (H1-H6) from HTML document
 */
export function extractHeadings(doc: Document): ParsedHeading[] {
  const headings: ParsedHeading[] = [];
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headingElements.forEach((element) => {
    const level = parseInt(element.tagName.substring(1));
    const text = element.textContent?.trim() || '';
    const id = element.getAttribute('id') || undefined;

    if (text) {
      headings.push({ level, text, id });
    }
  });

  return headings;
}

/**
 * Extract all images from HTML document
 */
export function extractImages(doc: Document): ParsedImage[] {
  const images: ParsedImage[] = [];
  const imageElements = doc.querySelectorAll('img');

  imageElements.forEach((img) => {
    const src = img.getAttribute('src');
    if (src) {
      images.push({
        src,
        alt: img.getAttribute('alt'),
        title: img.getAttribute('title'),
        width: img.width || undefined,
        height: img.height || undefined,
      });
    }
  });

  return images;
}

/**
 * Extract all links from HTML document
 */
export function extractLinks(doc: Document, baseUrl: string): ParsedLink[] {
  const links: ParsedLink[] = [];
  const linkElements = doc.querySelectorAll('a[href]');

  linkElements.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const isInternal = href.startsWith('/') || href.startsWith('#') || href.includes(baseUrl);
      const isExternal = href.startsWith('http') && !isInternal;

      links.push({
        href,
        text: link.textContent?.trim() || '',
        rel: link.getAttribute('rel'),
        target: link.getAttribute('target'),
        isInternal,
        isExternal,
      });
    }
  });

  return links;
}

/**
 * Extract body text content (excluding scripts, styles, etc.)
 */
export function extractBodyText(doc: Document): string {
  // Clone the body to avoid modifying the original
  const body = doc.body.cloneNode(true) as HTMLElement;

  // Remove scripts, styles, and other non-content elements
  body.querySelectorAll('script, style, noscript, iframe').forEach((el) => el.remove());

  return body.textContent?.trim() || '';
}

/**
 * Count words in a text string
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Check for structured data (JSON-LD, microdata, etc.)
 */
export function detectStructuredData(doc: Document): {
  hasStructuredData: boolean;
  types: string[];
} {
  const types: string[] = [];

  // Check for JSON-LD
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  jsonLdScripts.forEach((script) => {
    try {
      const data = JSON.parse(script.textContent || '');
      if (data['@type']) {
        types.push(data['@type']);
      }
    } catch (e) {
      // Invalid JSON-LD
    }
  });

  // Check for microdata
  const microdataElements = doc.querySelectorAll('[itemtype]');
  microdataElements.forEach((element) => {
    const itemtype = element.getAttribute('itemtype');
    if (itemtype) {
      types.push(itemtype.split('/').pop() || 'Unknown');
    }
  });

  return {
    hasStructuredData: types.length > 0,
    types,
  };
}

/**
 * Extract hreflang tags
 */
export function extractHreflangTags(doc: Document): Array<{ hreflang: string; href: string }> {
  const hreflangTags: Array<{ hreflang: string; href: string }> = [];
  const linkElements = doc.querySelectorAll('link[rel="alternate"][hreflang]');

  linkElements.forEach((link) => {
    const hreflang = link.getAttribute('hreflang');
    const href = link.getAttribute('href');
    if (hreflang && href) {
      hreflangTags.push({ hreflang, href });
    }
  });

  return hreflangTags;
}

/**
 * Parse complete HTML and extract all relevant SEO data
 */
export function parseHTMLContent(html: string, baseUrl: string): ParsedContent {
  const doc = parseHTML(html);
  const bodyText = extractBodyText(doc);
  const structuredData = detectStructuredData(doc);

  return {
    metadata: extractMetadata(doc),
    headings: extractHeadings(doc),
    images: extractImages(doc),
    links: extractLinks(doc, baseUrl),
    hreflangTags: extractHreflangTags(doc),
    bodyText,
    wordCount: countWords(bodyText),
    hasStructuredData: structuredData.hasStructuredData,
    structuredDataTypes: structuredData.types,
  };
}
