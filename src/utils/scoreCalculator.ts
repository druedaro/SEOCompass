import type { ValidationResult } from './validators';

/**
 * Calculate overall SEO score based on various validation results
 */

export interface SEOScoreBreakdown {
  overall: number;
  meta: number;
  content: number;
  technical: number;
  onPage: number;
}

export interface ScoreCalculationInput {
  titleValidation: ValidationResult;
  descriptionValidation: ValidationResult;
  urlValidation: ValidationResult;
  h1Validation: ValidationResult;
  headingHierarchyValidation: ValidationResult;
  imagesValidation: ValidationResult;
  contentLengthValidation: ValidationResult;
  canonicalValidation?: ValidationResult;
  hasStructuredData?: boolean;
  keywordOptimization?: number; // 0-100
  internalLinks?: number;
  externalLinks?: number;
}

/**
 * Weight constants for different SEO factors
 */
const WEIGHTS = {
  TITLE: 0.15,
  DESCRIPTION: 0.1,
  URL: 0.05,
  H1: 0.1,
  HEADING_HIERARCHY: 0.05,
  IMAGES: 0.08,
  CONTENT_LENGTH: 0.12,
  CANONICAL: 0.05,
  STRUCTURED_DATA: 0.05,
  KEYWORD_OPTIMIZATION: 0.15,
  INTERNAL_LINKS: 0.05,
  EXTERNAL_LINKS: 0.05,
};

/**
 * Calculate category scores
 */
function calculateCategoryScores(input: ScoreCalculationInput): {
  meta: number;
  content: number;
  technical: number;
  onPage: number;
} {
  // Meta score (Title + Description + URL)
  const metaScore =
    input.titleValidation.score * 0.5 +
    input.descriptionValidation.score * 0.35 +
    input.urlValidation.score * 0.15;

  // Content score (H1 + Headings + Content Length + Keywords)
  const keywordScore = input.keywordOptimization ?? 70;
  const contentScore =
    input.h1Validation.score * 0.25 +
    input.headingHierarchyValidation.score * 0.15 +
    input.contentLengthValidation.score * 0.35 +
    keywordScore * 0.25;

  // Technical score (Canonical + Structured Data + Images)
  const canonicalScore = input.canonicalValidation?.score ?? 85;
  const structuredDataScore = input.hasStructuredData ? 100 : 0;
  const technicalScore =
    canonicalScore * 0.3 +
    structuredDataScore * 0.3 +
    input.imagesValidation.score * 0.4;

  // On-Page score (Internal + External Links)
  const internalLinksScore = Math.min(100, (input.internalLinks ?? 0) * 10);
  const externalLinksScore = Math.min(100, (input.externalLinks ?? 0) * 20);
  const onPageScore = internalLinksScore * 0.6 + externalLinksScore * 0.4;

  return {
    meta: Math.round(metaScore),
    content: Math.round(contentScore),
    technical: Math.round(technicalScore),
    onPage: Math.round(onPageScore),
  };
}

/**
 * Calculate overall SEO score
 */
export function calculateSEOScore(input: ScoreCalculationInput): SEOScoreBreakdown {
  let totalScore = 0;

  // Add weighted scores
  totalScore += input.titleValidation.score * WEIGHTS.TITLE;
  totalScore += input.descriptionValidation.score * WEIGHTS.DESCRIPTION;
  totalScore += input.urlValidation.score * WEIGHTS.URL;
  totalScore += input.h1Validation.score * WEIGHTS.H1;
  totalScore += input.headingHierarchyValidation.score * WEIGHTS.HEADING_HIERARCHY;
  totalScore += input.imagesValidation.score * WEIGHTS.IMAGES;
  totalScore += input.contentLengthValidation.score * WEIGHTS.CONTENT_LENGTH;

  // Optional factors
  if (input.canonicalValidation) {
    totalScore += input.canonicalValidation.score * WEIGHTS.CANONICAL;
  } else {
    totalScore += 85 * WEIGHTS.CANONICAL; // Default reasonable score
  }

  if (input.hasStructuredData !== undefined) {
    totalScore += (input.hasStructuredData ? 100 : 0) * WEIGHTS.STRUCTURED_DATA;
  } else {
    totalScore += 50 * WEIGHTS.STRUCTURED_DATA; // Neutral score
  }

  if (input.keywordOptimization !== undefined) {
    totalScore += input.keywordOptimization * WEIGHTS.KEYWORD_OPTIMIZATION;
  } else {
    totalScore += 70 * WEIGHTS.KEYWORD_OPTIMIZATION; // Default
  }

  // Internal links score
  const internalLinksScore = Math.min(100, (input.internalLinks ?? 0) * 10);
  totalScore += internalLinksScore * WEIGHTS.INTERNAL_LINKS;

  // External links score
  const externalLinksScore = Math.min(100, (input.externalLinks ?? 0) * 20);
  totalScore += externalLinksScore * WEIGHTS.EXTERNAL_LINKS;

  // Calculate category scores
  const categoryScores = calculateCategoryScores(input);

  return {
    overall: Math.round(totalScore),
    meta: categoryScores.meta,
    content: categoryScores.content,
    technical: categoryScores.technical,
    onPage: categoryScores.onPage,
  };
}

/**
 * Get score grade (A, B, C, D, F)
 */
export function getScoreGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 90) {
    return { grade: 'A', label: 'Excellent', color: 'green' };
  } else if (score >= 80) {
    return { grade: 'B', label: 'Good', color: 'blue' };
  } else if (score >= 70) {
    return { grade: 'C', label: 'Fair', color: 'yellow' };
  } else if (score >= 60) {
    return { grade: 'D', label: 'Poor', color: 'orange' };
  } else {
    return { grade: 'F', label: 'Critical', color: 'red' };
  }
}

/**
 * Get priority level based on score
 */
export function getIssuePriority(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'high';
  return 'critical';
}

/**
 * Count total issues and warnings
 */
export function countIssues(input: ScoreCalculationInput): {
  critical: number;
  warnings: number;
  total: number;
} {
  let critical = 0;
  let warnings = 0;

  const validations = [
    input.titleValidation,
    input.descriptionValidation,
    input.urlValidation,
    input.h1Validation,
    input.headingHierarchyValidation,
    input.imagesValidation,
    input.contentLengthValidation,
  ];

  if (input.canonicalValidation) {
    validations.push(input.canonicalValidation);
  }

  validations.forEach((validation) => {
    critical += validation.issues.length;
    warnings += validation.warnings.length;
  });

  return {
    critical,
    warnings,
    total: critical + warnings,
  };
}

/**
 * Get improvement suggestions based on score breakdown
 */
export function getImprovementSuggestions(
  scoreBreakdown: SEOScoreBreakdown
): string[] {
  const suggestions: string[] = [];

  if (scoreBreakdown.meta < 70) {
    suggestions.push('Focus on improving title and meta description');
  }

  if (scoreBreakdown.content < 70) {
    suggestions.push('Enhance content quality, headings, and keyword usage');
  }

  if (scoreBreakdown.technical < 70) {
    suggestions.push('Add structured data and optimize technical SEO');
  }

  if (scoreBreakdown.onPage < 70) {
    suggestions.push('Improve internal and external linking strategy');
  }

  if (scoreBreakdown.overall < 60) {
    suggestions.push('This page needs significant SEO improvements');
  }

  return suggestions;
}

/**
 * Calculate keyword optimization score
 */
export function calculateKeywordOptimizationScore(
  focusKeyword: {
    inTitle: boolean;
    inDescription: boolean;
    inH1: boolean;
    inUrl: boolean;
    density: number;
  } | undefined
): number {
  if (!focusKeyword) return 50; // Neutral score if no focus keyword

  let score = 0;

  if (focusKeyword.inTitle) score += 30;
  if (focusKeyword.inDescription) score += 20;
  if (focusKeyword.inH1) score += 20;
  if (focusKeyword.inUrl) score += 15;

  // Keyword density (optimal range: 1-2.5%)
  if (focusKeyword.density >= 1 && focusKeyword.density <= 2.5) {
    score += 15;
  } else if (focusKeyword.density < 1) {
    score += Math.round(focusKeyword.density * 15); // Partial score
  } else if (focusKeyword.density > 3.5) {
    score -= 10; // Penalty for keyword stuffing
  }

  return Math.max(0, Math.min(100, score));
}
