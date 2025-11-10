/**
 * SEO Validators - Compact
 */

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  score: number;
}

const SEO_LIMITS = {
  TITLE_MIN: 30,
  TITLE_MAX: 60,
  DESC_MIN: 120,
  DESC_MAX: 160,
  URL_MAX: 100,
  H1_MAX: 70,
  WORD_COUNT_MIN: 300,
  IMAGE_ALT_MAX: 125,
};

export function validateTitle(title: string | null | undefined): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!title?.trim()) {
    return { isValid: false, issues: ['Title tag is missing'], warnings, score: 0 };
  }

  const len = title.length;
  if (len < SEO_LIMITS.TITLE_MIN) {
    issues.push(`Title too short (${len} chars, min: ${SEO_LIMITS.TITLE_MIN})`);
    score -= 30;
  } else if (len > SEO_LIMITS.TITLE_MAX) {
    issues.push(`Title too long (${len} chars, max: ${SEO_LIMITS.TITLE_MAX})`);
    score -= 20;
  } else if (len < 50) {
    warnings.push(`Title could be longer (${len} chars, optimal: 50-60)`);
    score -= 10;
  }

  if (/^(untitled|home)$/i.test(title)) {
    warnings.push('Title appears generic');
    score -= 15;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateDescription(description: string | null | undefined): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!description?.trim()) {
    return { isValid: false, issues: ['Meta description is missing'], warnings, score: 0 };
  }

  const len = description.length;
  if (len < SEO_LIMITS.DESC_MIN) {
    issues.push(`Description too short (${len} chars, min: ${SEO_LIMITS.DESC_MIN})`);
    score -= 30;
  } else if (len > SEO_LIMITS.DESC_MAX) {
    issues.push(`Description too long (${len} chars, max: ${SEO_LIMITS.DESC_MAX})`);
    score -= 20;
  } else if (len < 150) {
    warnings.push(`Description could be longer (${len} chars, optimal: 150-160)`);
    score -= 10;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateUrl(url: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;

    if (url.length > SEO_LIMITS.URL_MAX) {
      warnings.push(`URL is long (${url.length} chars, keep under ${SEO_LIMITS.URL_MAX})`);
      score -= 10;
    }
    if (urlObj.search) {
      warnings.push('URL contains query parameters');
      score -= 5;
    }
    if (path.includes('_')) {
      warnings.push('URL contains underscores, use hyphens');
      score -= 10;
    }
    if (path !== path.toLowerCase()) {
      warnings.push('URL contains uppercase, use lowercase');
      score -= 10;
    }
    if (/[^a-z0-9\-\/]/.test(path.toLowerCase())) {
      warnings.push('URL contains special characters');
      score -= 10;
    }
  } catch (error) {
    return { isValid: false, issues: ['Invalid URL format'], warnings, score: 0 };
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateH1(h1s: string[]): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (h1s.length === 0) {
    return { isValid: false, issues: ['No H1 heading found'], warnings, score: 0 };
  }
  if (h1s.length > 1) {
    issues.push(`Multiple H1 headings (${h1s.length}), use only one`);
    score -= 40;
  }

  const len = h1s[0].length;
  if (len > SEO_LIMITS.H1_MAX) {
    warnings.push(`H1 too long (${len} chars, max: ${SEO_LIMITS.H1_MAX})`);
    score -= 15;
  }
  if (len < 10) {
    warnings.push('H1 very short, make it more descriptive');
    score -= 10;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateHeadingHierarchy(headings: Array<{ level: number }>): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (headings.length === 0) {
    return { isValid: false, issues: ['No headings found'], warnings, score: 0 };
  }

  let prevLevel = 0;
  headings.forEach((h, i) => {
    if (h.level > prevLevel + 1 && i > 0) {
      warnings.push(`Heading hierarchy skips from H${prevLevel} to H${h.level}`);
      score -= 10;
    }
    prevLevel = h.level;
  });

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateImages(images: Array<{ src: string; alt: string | null }>): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (images.length === 0) {
    return { isValid: true, issues, warnings, score: 100 };
  }

  const noAlt = images.filter((img) => !img.alt?.trim());
  if (noAlt.length > 0) {
    issues.push(`${noAlt.length} images missing alt text`);
    score -= Math.min(50, noAlt.length * 10);
  }

  images.forEach((img) => {
    if (img.alt && img.alt.length > SEO_LIMITS.IMAGE_ALT_MAX) {
      warnings.push(`Alt text too long for image`);
      score -= 5;
    }
  });

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateContentLength(wordCount: number): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (wordCount < SEO_LIMITS.WORD_COUNT_MIN) {
    warnings.push(`Content short (${wordCount} words, aim for ${SEO_LIMITS.WORD_COUNT_MIN}+)`);
    score -= 20;
  }
  if (wordCount < 100) {
    issues.push('Content very thin, unlikely to rank');
    score -= 40;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateCanonical(canonicalUrl: string | null, currentUrl: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!canonicalUrl) {
    warnings.push('No canonical URL specified');
    score -= 15;
    return { isValid: true, issues, warnings, score };
  }

  try {
    if (new URL(canonicalUrl).href !== new URL(currentUrl).href) {
      warnings.push('Canonical URL differs from current URL');
      score -= 10;
    }
  } catch (error) {
    issues.push('Invalid canonical URL format');
    score -= 20;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

/**
 * Validate internal/external links
 */
export function validateLinks(links: { internal: number; external: number; broken?: number }): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (links.internal === 0) {
    warnings.push('No internal links - add links to related content');
    score -= 20;
  } else if (links.internal < 3) {
    warnings.push('Few internal links');
    score -= 10;
  }

  if (links.external === 0) {
    warnings.push('No external links - consider citing sources');
    score -= 10;
  }

  if (links.broken && links.broken > 0) {
    issues.push(`${links.broken} broken links detected`);
    score -= links.broken * 10;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

/**
 * Validate hreflang tags for international SEO
 */
export function validateHreflang(hreflangTags: Array<{ hreflang: string; href: string }>): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (hreflangTags.length === 0) {
    warnings.push('No hreflang tags - consider adding for international SEO');
    score -= 20;
    return { isValid: true, issues, warnings, score };
  }

  const hasXDefault = hreflangTags.some((tag) => tag.hreflang === 'x-default');
  if (!hasXDefault) {
    warnings.push('Missing x-default hreflang tag');
    score -= 15;
  }

  hreflangTags.forEach((tag) => {
    if (!tag.href || !tag.hreflang) {
      issues.push('Invalid hreflang tag format');
      score -= 20;
    }
  });

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

/**
 * Validate robots meta tag
 */
export function validateRobotsMeta(robotsMeta: string | null): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!robotsMeta) {
    return { isValid: true, issues, warnings, score };
  }

  const robotsLower = robotsMeta.toLowerCase();

  if (robotsLower.includes('noindex')) {
    issues.push('Page is set to noindex - will not appear in search results');
    score -= 100;
  }

  if (robotsLower.includes('nofollow')) {
    warnings.push('Page has nofollow directive - search engines won\'t follow links');
    score -= 30;
  }

  if (robotsLower.includes('none')) {
    issues.push('Robots set to "none" - equivalent to noindex, nofollow');
    score -= 100;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

