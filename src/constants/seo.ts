export const CATEGORY_STYLES: Record<
  'meta' | 'content' | 'technical' | 'links' | 'images',
  string
> = {
  meta: 'bg-[#82ca9d] text-white border-[#82ca9d]',
  content: 'bg-[#ffc658] text-gray-900 border-[#ffc658]',
  technical: 'bg-[#ff7c7c] text-white border-[#ff7c7c]',
  links: 'bg-[#a28dd8] text-white border-[#a28dd8]',
  images: 'bg-pink-100 text-pink-800',
};

export const SEO_LIMITS = {
  TITLE_MIN: 30,
  TITLE_MAX: 60,
  DESC_MIN: 120,
  DESC_MAX: 160,
  URL_MAX: 100,
  H1_MAX: 70,
  WORD_COUNT_MIN: 300,
  IMAGE_ALT_MAX: 125,
};

export const SEO_MESSAGES = {
  TITLE: {
    MISSING: 'Title tag is missing',
    TOO_SHORT: (len: number, min: number) => `Title too short (${len} chars, min: ${min})`,
    TOO_LONG: (len: number, max: number) => `Title too long (${len} chars, max: ${max})`,
    COULD_BE_LONGER: (len: number) => `Title could be longer (${len} chars, optimal: 50-60)`,
    GENERIC: 'Title appears generic',
  },
  DESCRIPTION: {
    MISSING: 'Meta description is missing',
    TOO_SHORT: (len: number, min: number) => `Description too short (${len} chars, min: ${min})`,
    TOO_LONG: (len: number, max: number) => `Description too long (${len} chars, max: ${max})`,
    COULD_BE_LONGER: (len: number) => `Description could be longer (${len} chars, optimal: 150-160)`,
  },
  URL: {
    INVALID: 'Invalid URL format',
    TOO_LONG: (len: number, max: number) => `URL is long (${len} chars, keep under ${max})`,
    HAS_QUERY_PARAMS: 'URL contains query parameters',
    HAS_UNDERSCORES: 'URL contains underscores, use hyphens',
    HAS_UPPERCASE: 'URL contains uppercase, use lowercase',
    HAS_SPECIAL_CHARS: 'URL contains special characters',
  },
  H1: {
    MISSING: 'No H1 heading found',
    MULTIPLE: (count: number) => `Multiple H1 headings (${count}), use only one`,
    TOO_LONG: (len: number, max: number) => `H1 too long (${len} chars, max: ${max})`,
    TOO_SHORT: 'H1 very short, make it more descriptive',
  },
  HEADINGS: {
    NONE: 'No headings found',
    HIERARCHY_SKIP: (from: number, to: number) => `Heading hierarchy skips from H${from} to H${to}`,
  },
  IMAGES: {
    MISSING_ALT: (count: number) => `${count} images missing alt text`,
    ALT_TOO_LONG: 'Alt text too long for image',
  },
  CONTENT: {
    TOO_SHORT: (count: number, min: number) => `Content short (${count} words, aim for ${min}+)`,
    VERY_THIN: 'Content very thin, unlikely to rank',
  },
  CANONICAL: {
    MISSING: 'No canonical URL specified',
    DIFFERS: 'Canonical URL differs from current URL',
    INVALID: 'Invalid canonical URL format',
  },
  LINKS: {
    NO_INTERNAL: 'No internal links - add links to related content',
    FEW_INTERNAL: 'Few internal links',
    NO_EXTERNAL: 'No external links - consider citing sources',
    BROKEN: (count: number) => `${count} broken links detected`,
  },
  HREFLANG: {
    NONE: 'No hreflang tags - consider adding for international SEO',
    MISSING_X_DEFAULT: 'Missing x-default hreflang tag',
    INVALID_FORMAT: 'Invalid hreflang tag format',
  },
  ROBOTS: {
    NOINDEX: 'Page is set to noindex - will not appear in search results',
    NOFOLLOW: 'Page has nofollow directive - search engines won\'t follow links',
    NONE: 'Robots set to "none" - equivalent to noindex, nofollow',
  },
};

export const SEO_RECOMMENDATIONS = {
  ERROR_404: {
    title: '404 Error - Page Not Found',
    description: 'This page returns a 404 error.',
    action: 'Fix the URL or restore the page content immediately.',
  },
  ERROR_5XX: {
    title: 'Server Error (5xx)',
    description: 'This page is returning a server error.',
    action: 'Check server configuration and logs.',
  },
  TITLE: {
    title: 'Title Tag',
    action: 'Add a descriptive title (50-60 chars) with your main topic.',
  },
  DESCRIPTION: {
    title: 'Meta Description',
    action: 'Write a compelling description (150-160 chars) summarizing the page.',
  },
  URL: {
    title: 'URL Structure',
    action: 'Use lowercase, hyphens, and remove special characters/stop words.',
  },
  H1_SINGLE: {
    title: 'H1 Heading',
    action: 'Add a single H1 heading describing the page topic.',
  },
  H1_MULTIPLE: {
    title: 'H1 Heading',
    action: 'Use only one H1 heading per page.',
  },
  HEADING_HIERARCHY: {
    title: 'Heading Hierarchy',
    action: 'Follow proper heading order (H1 → H2 → H3) without skipping levels.',
  },
  CONTENT_LENGTH: {
    title: 'Content Length',
    action: (wordCount: number) => `Expand content to at least 300 words (current: ${wordCount}).`,
  },
  CANONICAL: {
    title: 'Canonical Tag',
    action: 'Add or fix canonical tag to avoid duplicate content issues.',
  },
  CANONICAL_MISSING: {
    title: 'Missing Canonical Tag',
    description: 'No canonical URL specified.',
    action: 'Add a canonical tag to this page.',
  },
  ROBOTS: {
    title: 'Robots Meta Tag',
    action: 'Review robots meta tag settings.',
  },
  IMAGES_ALT: {
    title: 'Missing Image Alt Text',
    action: 'Add descriptive alt text to all images for SEO and accessibility.',
  },
  IMAGES_OK: {
    title: 'Images OK',
    description: (score: number) => `All images have alt text (Score: ${score}/100).`,
    action: 'No action needed.',
  },
  STRUCTURED_DATA_MISSING: {
    title: 'No Structured Data',
    description: 'Page lacks structured data (Schema.org).',
    action: 'Add JSON-LD structured data matching your content type.',
  },
  STRUCTURED_DATA_OK: {
    title: 'Structured Data Present',
    description: 'Page has structured data configured.',
    action: 'No action needed.',
  },
  INTERNAL_LINKS_FEW: {
    title: 'Few Internal Links',
    description: (count: number) => `Only ${count} internal links found.`,
    action: 'Add more internal links to related content on your site.',
  },
  INTERNAL_LINKS_OK: {
    title: 'Internal Links OK',
    description: (count: number) => `${count} internal links found.`,
    action: 'Good internal linking structure.',
  },
  EXTERNAL_LINKS_NONE: {
    title: 'No External Links',
    description: 'No external links detected.',
    action: 'Consider linking to authoritative external sources.',
  },
  EXTERNAL_LINKS_OK: {
    title: 'External Links Present',
    description: (count: number) => `${count} external links found.`,
    action: 'Good use of external references.',
  },
  GENERIC_OK: {
    description: (title: string, score: number) => `${title} is properly configured (Score: ${score}/100).`,
    action: 'No action needed.',
  },
};

