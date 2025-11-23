import { SEO_LIMITS, SEO_MESSAGES } from '@/constants/seo';
import type { ValidationResult } from '@/types/seoTypes';

export function validateTitle(title: string | null | undefined): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!title?.trim()) {
    return { isValid: false, issues: [SEO_MESSAGES.TITLE.MISSING], warnings, score: 0 };
  }

  const len = title.length;
  if (len < SEO_LIMITS.TITLE_MIN) {
    issues.push(SEO_MESSAGES.TITLE.TOO_SHORT(len, SEO_LIMITS.TITLE_MIN));
    score -= 30;
  } else if (len > SEO_LIMITS.TITLE_MAX) {
    issues.push(SEO_MESSAGES.TITLE.TOO_LONG(len, SEO_LIMITS.TITLE_MAX));
    score -= 20;
  } else if (len < 50) {
    warnings.push(SEO_MESSAGES.TITLE.COULD_BE_LONGER(len));
    score -= 10;
  }

  if (/^(untitled|home)$/i.test(title)) {
    warnings.push(SEO_MESSAGES.TITLE.GENERIC);
    score -= 15;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateDescription(description: string | null | undefined): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!description?.trim()) {
    return { isValid: false, issues: [SEO_MESSAGES.DESCRIPTION.MISSING], warnings, score: 0 };
  }

  const len = description.length;
  if (len < SEO_LIMITS.DESC_MIN) {
    issues.push(SEO_MESSAGES.DESCRIPTION.TOO_SHORT(len, SEO_LIMITS.DESC_MIN));
    score -= 30;
  } else if (len > SEO_LIMITS.DESC_MAX) {
    issues.push(SEO_MESSAGES.DESCRIPTION.TOO_LONG(len, SEO_LIMITS.DESC_MAX));
    score -= 20;
  } else if (len < 150) {
    warnings.push(SEO_MESSAGES.DESCRIPTION.COULD_BE_LONGER(len));
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
      warnings.push(SEO_MESSAGES.URL.TOO_LONG(url.length, SEO_LIMITS.URL_MAX));
      score -= 10;
    }
    if (urlObj.search) {
      warnings.push(SEO_MESSAGES.URL.HAS_QUERY_PARAMS);
      score -= 5;
    }
    if (path.includes('_')) {
      warnings.push(SEO_MESSAGES.URL.HAS_UNDERSCORES);
      score -= 10;
    }
    if (path !== path.toLowerCase()) {
      warnings.push(SEO_MESSAGES.URL.HAS_UPPERCASE);
      score -= 10;
    }
    if (/[^a-z0-9\-/]/.test(path.toLowerCase())) {
      warnings.push(SEO_MESSAGES.URL.HAS_SPECIAL_CHARS);
      score -= 10;
    }
  } catch {
    return { isValid: false, issues: [SEO_MESSAGES.URL.INVALID], warnings, score: 0 };
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateH1(h1s: string[]): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (h1s.length === 0) {
    return { isValid: false, issues: [SEO_MESSAGES.H1.MISSING], warnings, score: 0 };
  }
  if (h1s.length > 1) {
    issues.push(SEO_MESSAGES.H1.MULTIPLE(h1s.length));
    score -= 40;
  }

  const len = h1s[0].length;
  if (len > SEO_LIMITS.H1_MAX) {
    warnings.push(SEO_MESSAGES.H1.TOO_LONG(len, SEO_LIMITS.H1_MAX));
    score -= 15;
  }
  if (len < 10) {
    warnings.push(SEO_MESSAGES.H1.TOO_SHORT);
    score -= 10;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateHeadingHierarchy(headings: Array<{ level: number }>): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (headings.length === 0) {
    return { isValid: false, issues: [SEO_MESSAGES.HEADINGS.NONE], warnings, score: 0 };
  }


  if (headings[0].level > 1) {
    warnings.push(SEO_MESSAGES.HEADINGS.HIERARCHY_SKIP(0, headings[0].level));
    score -= 15;
  }

  for (let i = 1; i < headings.length; i++) {
    const currentLevel = headings[i].level;
    const prevLevel = headings[i - 1].level;

    if (currentLevel > prevLevel + 1) {
      warnings.push(SEO_MESSAGES.HEADINGS.HIERARCHY_SKIP(prevLevel, currentLevel));
      score -= 10;
    }
  }

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
    issues.push(SEO_MESSAGES.IMAGES.MISSING_ALT(noAlt.length));
    score -= Math.min(50, noAlt.length * 10);
  }

  images.forEach((img) => {
    if (img.alt && img.alt.length > SEO_LIMITS.IMAGE_ALT_MAX) {
      warnings.push(SEO_MESSAGES.IMAGES.ALT_TOO_LONG);
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
    warnings.push(SEO_MESSAGES.CONTENT.TOO_SHORT(wordCount, SEO_LIMITS.WORD_COUNT_MIN));
    score -= 20;
  }
  if (wordCount < 100) {
    issues.push(SEO_MESSAGES.CONTENT.VERY_THIN);
    score -= 40;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateCanonical(canonicalUrl: string | null, currentUrl: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!canonicalUrl) {
    warnings.push(SEO_MESSAGES.CANONICAL.MISSING);
    score -= 15;
    return { isValid: true, issues, warnings, score };
  }

  try {
    if (new URL(canonicalUrl).href !== new URL(currentUrl).href) {
      warnings.push(SEO_MESSAGES.CANONICAL.DIFFERS);
      score -= 10;
    }
  } catch {
    issues.push(SEO_MESSAGES.CANONICAL.INVALID);
    score -= 20;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateLinks(links: { internal: number; external: number; broken?: number }): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (links.internal === 0) {
    warnings.push(SEO_MESSAGES.LINKS.NO_INTERNAL);
    score -= 20;
  } else if (links.internal < 3) {
    warnings.push(SEO_MESSAGES.LINKS.FEW_INTERNAL);
    score -= 10;
  }

  if (links.external === 0) {
    warnings.push(SEO_MESSAGES.LINKS.NO_EXTERNAL);
    score -= 10;
  }

  if (links.broken && links.broken > 0) {
    issues.push(SEO_MESSAGES.LINKS.BROKEN(links.broken));
    score -= links.broken * 10;
  }

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateHreflang(hreflangTags: Array<{ hreflang: string; href: string }>): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (hreflangTags.length === 0) {
    warnings.push(SEO_MESSAGES.HREFLANG.NONE);
    score -= 20;
    return { isValid: true, issues, warnings, score };
  }

  const hasXDefault = hreflangTags.some((tag) => tag.hreflang === 'x-default');
  if (!hasXDefault) {
    warnings.push(SEO_MESSAGES.HREFLANG.MISSING_X_DEFAULT);
    score -= 15;
  }

  hreflangTags.forEach((tag) => {
    if (!tag.href || !tag.hreflang) {
      issues.push(SEO_MESSAGES.HREFLANG.INVALID_FORMAT);
      score -= 20;
    }
  });

  return { isValid: issues.length === 0, issues, warnings, score: Math.max(0, score) };
}

export function validateRobotsMeta(robotsMeta: string | null): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (!robotsMeta || !robotsMeta.trim()) {
    issues.push('Robots meta tag is missing.');
    return { isValid: false, issues, warnings, score: 0 };
  }

  const robotsLower = robotsMeta.toLowerCase().trim();

  if (robotsLower.includes('index') && robotsLower.includes('follow')) {
    return { isValid: true, issues, warnings, score: 100 };
  }

  return { isValid: false, issues, warnings, score: 0 };
}

export function validateHttpStatus(scrapedContent: { statusCode: number }): { has404: boolean; hasServer: boolean } {
  return {
    has404: scrapedContent.statusCode === 404,
    hasServer: scrapedContent.statusCode >= 500,
  };
}