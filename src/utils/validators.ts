/**
 * SEO Validators
 * Validate titles, meta descriptions, URLs, headings, and other SEO elements
 */

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  score: number; // 0-100
}

// SEO Best Practice Limits
const SEO_LIMITS = {
  TITLE_MIN: 30,
  TITLE_MAX: 60,
  TITLE_OPTIMAL_MIN: 50,
  TITLE_OPTIMAL_MAX: 60,
  DESCRIPTION_MIN: 120,
  DESCRIPTION_MAX: 160,
  DESCRIPTION_OPTIMAL_MIN: 150,
  DESCRIPTION_OPTIMAL_MAX: 160,
  URL_MAX: 100,
  H1_MAX: 70,
  WORD_COUNT_MIN: 300,
  KEYWORD_DENSITY_MAX: 3.5,
  IMAGE_ALT_MAX: 125,
};

/**
 * Validate title tag
 */
export function validateTitle(title: string | null | undefined): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!title || title.trim().length === 0) {
    issues.push('Title tag is missing');
    return { isValid: false, issues, warnings, score: 0 };
  }

  const length = title.length;

  // Check length
  if (length < SEO_LIMITS.TITLE_MIN) {
    issues.push(`Title is too short (${length} chars). Minimum: ${SEO_LIMITS.TITLE_MIN}`);
    score -= 30;
  } else if (length > SEO_LIMITS.TITLE_MAX) {
    issues.push(`Title is too long (${length} chars). Maximum: ${SEO_LIMITS.TITLE_MAX}`);
    score -= 20;
  } else if (length < SEO_LIMITS.TITLE_OPTIMAL_MIN) {
    warnings.push(`Title could be longer for better SEO (${length} chars). Optimal: ${SEO_LIMITS.TITLE_OPTIMAL_MIN}-${SEO_LIMITS.TITLE_OPTIMAL_MAX}`);
    score -= 10;
  }

  // Check for common issues
  if (title.toLowerCase() === 'untitled' || title.toLowerCase() === 'home') {
    warnings.push('Title appears to be generic or default');
    score -= 15;
  }

  if (title.split('|').length > 2 || title.split('-').length > 2) {
    warnings.push('Title contains multiple separators, may look cluttered');
    score -= 5;
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate meta description
 */
export function validateDescription(description: string | null | undefined): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!description || description.trim().length === 0) {
    issues.push('Meta description is missing');
    return { isValid: false, issues, warnings, score: 0 };
  }

  const length = description.length;

  // Check length
  if (length < SEO_LIMITS.DESCRIPTION_MIN) {
    issues.push(`Description is too short (${length} chars). Minimum: ${SEO_LIMITS.DESCRIPTION_MIN}`);
    score -= 30;
  } else if (length > SEO_LIMITS.DESCRIPTION_MAX) {
    issues.push(`Description is too long (${length} chars). Maximum: ${SEO_LIMITS.DESCRIPTION_MAX}`);
    score -= 20;
  } else if (length < SEO_LIMITS.DESCRIPTION_OPTIMAL_MIN) {
    warnings.push(`Description could be longer (${length} chars). Optimal: ${SEO_LIMITS.DESCRIPTION_OPTIMAL_MIN}-${SEO_LIMITS.DESCRIPTION_OPTIMAL_MAX}`);
    score -= 10;
  }

  // Check for duplicate content with title
  if (description === description) { // Placeholder check
    // Could add logic to compare with title
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate URL structure
 */
export function validateUrl(url: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;

    // Check URL length
    if (url.length > SEO_LIMITS.URL_MAX) {
      warnings.push(`URL is long (${url.length} chars). Keep it under ${SEO_LIMITS.URL_MAX}`);
      score -= 10;
    }

    // Check for query parameters
    if (urlObj.search) {
      warnings.push('URL contains query parameters, consider using clean URLs');
      score -= 5;
    }

    // Check for underscores (should use hyphens)
    if (path.includes('_')) {
      warnings.push('URL contains underscores, consider using hyphens instead');
      score -= 10;
    }

    // Check for uppercase letters
    if (path !== path.toLowerCase()) {
      warnings.push('URL contains uppercase letters, use lowercase for consistency');
      score -= 10;
    }

    // Check for special characters
    if (/[^a-z0-9\-\/]/.test(path.toLowerCase())) {
      warnings.push('URL contains special characters');
      score -= 10;
    }

    // Check for meaningful structure
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) {
      warnings.push('URL has no path segments (homepage)');
    }

    // Check for stop words in URL
    const stopWords = ['and', 'or', 'but', 'the', 'a', 'an'];
    const hasStopWords = segments.some((seg) =>
      stopWords.some((word) => seg.toLowerCase().includes(word))
    );
    if (hasStopWords) {
      warnings.push('URL contains stop words, consider removing them');
      score -= 5;
    }
  } catch (error) {
    issues.push('Invalid URL format');
    return { isValid: false, issues, warnings, score: 0 };
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate H1 heading
 */
export function validateH1(h1s: string[]): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (h1s.length === 0) {
    issues.push('No H1 heading found on page');
    return { isValid: false, issues, warnings, score: 0 };
  }

  if (h1s.length > 1) {
    issues.push(`Multiple H1 headings found (${h1s.length}). Use only one H1 per page`);
    score -= 40;
  }

  const h1 = h1s[0];
  const length = h1.length;

  if (length > SEO_LIMITS.H1_MAX) {
    warnings.push(`H1 is too long (${length} chars). Keep it under ${SEO_LIMITS.H1_MAX}`);
    score -= 15;
  }

  if (length < 10) {
    warnings.push('H1 is very short, consider making it more descriptive');
    score -= 10;
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate heading hierarchy (H1 -> H2 -> H3, etc.)
 */
export function validateHeadingHierarchy(headings: Array<{ level: number; text: string }>): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (headings.length === 0) {
    issues.push('No headings found on page');
    return { isValid: false, issues, warnings, score: 0 };
  }

  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const { level } = heading;

    // Check for skipped levels
    if (level > previousLevel + 1 && index > 0) {
      warnings.push(`Heading hierarchy skips from H${previousLevel} to H${level}`);
      score -= 10;
    }

    previousLevel = level;
  });

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate images for SEO
 */
export function validateImages(
  images: Array<{ src: string; alt: string | null }>
): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (images.length === 0) {
    return { isValid: true, issues, warnings, score: 100 };
  }

  const imagesWithoutAlt = images.filter((img) => !img.alt || img.alt.trim() === '');

  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    score -= Math.min(50, imagesWithoutAlt.length * 10);
  }

  // Check alt text length
  images.forEach((img) => {
    if (img.alt && img.alt.length > SEO_LIMITS.IMAGE_ALT_MAX) {
      warnings.push(`Alt text too long for image ${img.src.substring(0, 30)}...`);
      score -= 5;
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate content length
 */
export function validateContentLength(wordCount: number): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (wordCount < SEO_LIMITS.WORD_COUNT_MIN) {
    warnings.push(`Content is short (${wordCount} words). Aim for at least ${SEO_LIMITS.WORD_COUNT_MIN} words`);
    score -= 20;
  }

  if (wordCount < 100) {
    issues.push('Content is very thin, unlikely to rank well');
    score -= 40;
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validate canonical URL
 */
export function validateCanonical(
  canonicalUrl: string | null,
  currentUrl: string
): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!canonicalUrl) {
    warnings.push('No canonical URL specified');
    score -= 15;
    return { isValid: true, issues, warnings, score };
  }

  // Check if canonical is the same as current URL
  try {
    const canonical = new URL(canonicalUrl);
    const current = new URL(currentUrl);

    if (canonical.href !== current.href) {
      warnings.push('Canonical URL differs from current URL');
      score -= 10;
    }
  } catch (error) {
    issues.push('Invalid canonical URL format');
    score -= 20;
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    score: Math.max(0, score),
  };
}
