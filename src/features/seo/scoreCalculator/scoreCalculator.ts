import type { SEOScoreBreakdown, ScoreCalculationInput } from '@/types/seoTypes';
import { SEO_WEIGHTS } from '@/constants/seo';

function calculateProgressScore(current: number | undefined, target: number): number {
  const value = current ?? 0;
  if (value >= target) return 100;
  return Math.round((value / target) * 100);
}

function calculateCategoryScores(input: ScoreCalculationInput): {
  meta: number;
  content: number;
  technical: number;
  onPage: number;
} {
  const metaScore =
    input.titleValidation.score * 0.5 +
    input.descriptionValidation.score * 0.35 +
    input.urlValidation.score * 0.15;

  const contentScore =
    input.h1Validation.score * 0.30 +
    input.headingHierarchyValidation.score * 0.20 +
    input.contentLengthValidation.score * 0.50;

  const canonicalScore = input.canonicalValidation?.score ?? 85;
  const structuredDataScore = input.hasStructuredData ? 100 : 0;

  const technicalScore =
    canonicalScore * 0.3 +
    structuredDataScore * 0.3 +
    input.imagesValidation.score * 0.4;

  const internalLinksScore = calculateProgressScore(input.internalLinks, 10);
  const externalLinksScore = calculateProgressScore(input.externalLinks, 5);

  const onPageScore = internalLinksScore * 0.6 + externalLinksScore * 0.4;

  return {
    meta: Math.round(metaScore),
    content: Math.round(contentScore),
    technical: Math.round(technicalScore),
    onPage: Math.round(onPageScore),
  };
}

export function calculateSEOScore(input: ScoreCalculationInput): SEOScoreBreakdown {
  let totalScore = 0;

  totalScore += input.titleValidation.score * SEO_WEIGHTS.TITLE;
  totalScore += input.descriptionValidation.score * SEO_WEIGHTS.DESCRIPTION;
  totalScore += input.urlValidation.score * SEO_WEIGHTS.URL;
  totalScore += input.h1Validation.score * SEO_WEIGHTS.H1;
  totalScore += input.headingHierarchyValidation.score * SEO_WEIGHTS.HEADING_HIERARCHY;
  totalScore += input.imagesValidation.score * SEO_WEIGHTS.IMAGES;
  totalScore += input.contentLengthValidation.score * SEO_WEIGHTS.CONTENT_LENGTH;

  if (input.canonicalValidation) {
    totalScore += input.canonicalValidation.score * SEO_WEIGHTS.CANONICAL;
  } else {
    totalScore += 85 * SEO_WEIGHTS.CANONICAL;
  }

  if (input.hasStructuredData !== undefined) {
    totalScore += (input.hasStructuredData ? 100 : 0) * SEO_WEIGHTS.STRUCTURED_DATA;
  } else {
    totalScore += 50 * SEO_WEIGHTS.STRUCTURED_DATA;
  }

  const internalLinksScore = calculateProgressScore(input.internalLinks, 10);
  totalScore += internalLinksScore * SEO_WEIGHTS.INTERNAL_LINKS;

  const externalLinksScore = calculateProgressScore(input.externalLinks, 5);
  totalScore += externalLinksScore * SEO_WEIGHTS.EXTERNAL_LINKS;

  if (input.linksValidation) {
    totalScore += input.linksValidation.score * SEO_WEIGHTS.LINKS;
  } else {
    totalScore += 70 * SEO_WEIGHTS.LINKS;
  }

  if (input.hreflangValidation) {
    totalScore += input.hreflangValidation.score * SEO_WEIGHTS.HREFLANG;
  } else {
    totalScore += 80 * SEO_WEIGHTS.HREFLANG;
  }

  if (input.robotsValidation) {
    totalScore += input.robotsValidation.score * SEO_WEIGHTS.ROBOTS;
  } else {
    totalScore += 100 * SEO_WEIGHTS.ROBOTS;
  }

  const categoryScores = calculateCategoryScores(input);

  return {
    overall: Math.min(100, Math.round(totalScore)),
    meta: categoryScores.meta,
    content: categoryScores.content,
    technical: categoryScores.technical,
    onPage: categoryScores.onPage,
  };
}


