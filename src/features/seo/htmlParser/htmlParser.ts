import type { ParsedMetadata, ParsedHeading, ParsedImage, ParsedLink, ParsedContent } from '@/types/seoTypes';

function parseHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

function extractMetadata(doc: Document): ParsedMetadata {
  const getMetaContent = (selector: string): string | null => {
    const element = doc.querySelector(selector);
    return element?.getAttribute('content') || null;
  };

  return {
    title: doc.querySelector('title')?.textContent || null,
    description: getMetaContent('meta[name="description"]'),
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    robots: getMetaContent('meta[name="robots"]'),
    author: getMetaContent('meta[name="author"]'),
    language: doc.documentElement.getAttribute('lang') || null,
    viewport: getMetaContent('meta[name="viewport"]'),
  };
}


function extractHeadings(doc: Document): ParsedHeading[] {
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


function extractImages(doc: Document): ParsedImage[] {
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

function extractLinks(doc: Document, baseUrl: string): ParsedLink[] {
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

function extractBodyText(doc: Document): string {
  const body = doc.body.cloneNode(true) as HTMLElement;

  body.querySelectorAll('script, style, noscript, iframe').forEach((el) => el.remove());

  return body.textContent?.trim() || '';
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}


function detectStructuredData(doc: Document): {
  hasStructuredData: boolean;
  types: string[];
} {
  const types: string[] = [];

  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  jsonLdScripts.forEach((script) => {
    const content = script.textContent;
    if (content) {
      const data = JSON.parse(content);
      if (data['@type']) {
        types.push(data['@type']);
      }
    }
  });

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


function extractHreflangTags(doc: Document): Array<{ hreflang: string; href: string }> {
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
export function extractH1Texts(parsedContent: ParsedContent): string[] {
  return parsedContent.headings
    .filter((h) => h.level === 1)
    .map((h) => h.text);
}

export function countLinks(parsedContent: ParsedContent): { internal: number; external: number } {
  const internal = parsedContent.links.filter((link) => link.isInternal).length;
  const external = parsedContent.links.filter((link) => link.isExternal).length;
  return { internal, external };
}
