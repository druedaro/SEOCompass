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
  linksValidation?: ValidationResult;
  hreflangValidation?: ValidationResult;
  robotsValidation?: ValidationResult;
  hasStructuredData?: boolean;
  keywordOptimization?: number;
  internalLinks?: number;
  externalLinks?: number;
}

/**
 * Weight constants for different SEO factors
 */
const WEIGHTS = {
  TITLE: 0.14,
  DESCRIPTION: 0.10,
  URL: 0.05,
  H1: 0.10,
  HEADING_HIERARCHY: 0.05,
  IMAGES: 0.09,
  CONTENT_LENGTH: 0.12,
  CANONICAL: 0.05,
  STRUCTURED_DATA: 0.05,
  KEYWORD_OPTIMIZATION: 0.13,
  INTERNAL_LINKS: 0.05,
  EXTERNAL_LINKS: 0.04,
  LINKS: 0.05,
  HREFLANG: 0.02,
  ROBOTS: 0.01,
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

  // Links validation
  if (input.linksValidation) {
    totalScore += input.linksValidation.score * WEIGHTS.LINKS;
  } else {
    totalScore += 70 * WEIGHTS.LINKS;
  }

  // Hreflang validation
  if (input.hreflangValidation) {
    totalScore += input.hreflangValidation.score * WEIGHTS.HREFLANG;
  } else {
    totalScore += 80 * WEIGHTS.HREFLANG;
  }

  // Robots meta validation
  if (input.robotsValidation) {
    totalScore += input.robotsValidation.score * WEIGHTS.ROBOTS;
  } else {
    totalScore += 100 * WEIGHTS.ROBOTS;
  }

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


