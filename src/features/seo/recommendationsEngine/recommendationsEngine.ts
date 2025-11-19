import type { ValidationResult, Recommendation, RecommendationInput } from '@/types/seoTypes';
import { SEO_RECOMMENDATIONS } from '@/constants/seo';

export function generateRecommendations(input: RecommendationInput): Recommendation[] {
  const technicalRecs = getTechnicalRecommendations(input);
  const metaRecs = getMetaRecommendations(input);
  const contentRecs = getContentRecommendations(input);
  const imageRecs = getImageRecommendations(input);
  const linkRecs = getLinkRecommendations(input);

  const allRecs = [
    ...technicalRecs,
    ...metaRecs,
    ...contentRecs,
    ...imageRecs,
    ...linkRecs
  ];

  return allRecs
    .map((rec, index) => ({ ...rec, id: `rec-${index}` }))
    .sort((a, b) => b.priority - a.priority);
}

function getTechnicalRecommendations(input: RecommendationInput): Omit<Recommendation, 'id'>[] {
  const recs: Omit<Recommendation, 'id'>[] = [];

  if (input.has404Error) {
    recs.push({
      category: 'technical',
      severity: 'critical',
      title: SEO_RECOMMENDATIONS.ERROR_404.title,
      description: SEO_RECOMMENDATIONS.ERROR_404.description,
      action: SEO_RECOMMENDATIONS.ERROR_404.action,
      priority: 10,
    });
  }

  if (input.hasServerError) {
    recs.push({
      category: 'technical',
      severity: 'critical',
      title: SEO_RECOMMENDATIONS.ERROR_5XX.title,
      description: SEO_RECOMMENDATIONS.ERROR_5XX.description,
      action: SEO_RECOMMENDATIONS.ERROR_5XX.action,
      priority: 10,
    });
  }

  recs.push(...getIssueRecommendations(
    input.urlValidation,
    'technical',
    SEO_RECOMMENDATIONS.URL.title,
    SEO_RECOMMENDATIONS.URL.action
  ));

  if (input.canonicalValidation) {
    recs.push(...getIssueRecommendations(
      input.canonicalValidation,
      'technical',
      SEO_RECOMMENDATIONS.CANONICAL.title,
      SEO_RECOMMENDATIONS.CANONICAL.action
    ));
  } else {
    recs.push({
      category: 'technical',
      severity: 'critical',
      title: SEO_RECOMMENDATIONS.CANONICAL_MISSING.title,
      description: SEO_RECOMMENDATIONS.CANONICAL_MISSING.description,
      action: SEO_RECOMMENDATIONS.CANONICAL_MISSING.action,
      priority: 10,
    });
  }

  if (input.robotsValidation) {
    recs.push(...getIssueRecommendations(
      input.robotsValidation,
      'technical',
      SEO_RECOMMENDATIONS.ROBOTS.title,
      SEO_RECOMMENDATIONS.ROBOTS.action
    ));
  }

  if (!input.hasStructuredData) {
    recs.push({
      category: 'technical',
      severity: 'warning',
      title: SEO_RECOMMENDATIONS.STRUCTURED_DATA_MISSING.title,
      description: SEO_RECOMMENDATIONS.STRUCTURED_DATA_MISSING.description,
      action: SEO_RECOMMENDATIONS.STRUCTURED_DATA_MISSING.action,
      priority: 5,
    });
  } else {
    recs.push({
      category: 'technical',
      severity: 'info',
      title: SEO_RECOMMENDATIONS.STRUCTURED_DATA_OK.title,
      description: SEO_RECOMMENDATIONS.STRUCTURED_DATA_OK.description,
      action: SEO_RECOMMENDATIONS.STRUCTURED_DATA_OK.action,
      priority: 1,
    });
  }

  return recs;
}

function getMetaRecommendations(input: RecommendationInput): Omit<Recommendation, 'id'>[] {
  const recs: Omit<Recommendation, 'id'>[] = [];

  recs.push(...getIssueRecommendations(
    input.titleValidation,
    'meta',
    SEO_RECOMMENDATIONS.TITLE.title,
    SEO_RECOMMENDATIONS.TITLE.action
  ));

  recs.push(...getIssueRecommendations(
    input.descriptionValidation,
    'meta',
    SEO_RECOMMENDATIONS.DESCRIPTION.title,
    SEO_RECOMMENDATIONS.DESCRIPTION.action
  ));

  return recs;
}

function getContentRecommendations(input: RecommendationInput): Omit<Recommendation, 'id'>[] {
  const recs: Omit<Recommendation, 'id'>[] = [];

  recs.push(...getIssueRecommendations(
    input.h1Validation,
    'content',
    SEO_RECOMMENDATIONS.H1_SINGLE.title,
    input.h1s && input.h1s.length > 1
      ? SEO_RECOMMENDATIONS.H1_MULTIPLE.action
      : SEO_RECOMMENDATIONS.H1_SINGLE.action
  ));

  recs.push(...getIssueRecommendations(
    input.headingHierarchyValidation,
    'content',
    SEO_RECOMMENDATIONS.HEADING_HIERARCHY.title,
    SEO_RECOMMENDATIONS.HEADING_HIERARCHY.action
  ));

  recs.push(...getIssueRecommendations(
    input.contentLengthValidation,
    'content',
    SEO_RECOMMENDATIONS.CONTENT_LENGTH.title,
    SEO_RECOMMENDATIONS.CONTENT_LENGTH.action(input.wordCount || 0)
  ));

  return recs;
}

function getImageRecommendations(input: RecommendationInput): Omit<Recommendation, 'id'>[] {
  const recs: Omit<Recommendation, 'id'>[] = [];

  if (input.imagesValidation.issues.length > 0) {
    const missingAlt = input.imagesValidation.issues[0];
    recs.push({
      category: 'images',
      severity: 'warning',
      title: SEO_RECOMMENDATIONS.IMAGES_ALT.title,
      description: missingAlt,
      action: SEO_RECOMMENDATIONS.IMAGES_ALT.action,
      priority: 6,
    });
  } else if (input.imagesValidation.isValid) {
    recs.push({
      category: 'images',
      severity: 'info',
      title: SEO_RECOMMENDATIONS.IMAGES_OK.title,
      description: SEO_RECOMMENDATIONS.IMAGES_OK.description(input.imagesValidation.score),
      action: SEO_RECOMMENDATIONS.IMAGES_OK.action,
      priority: 1,
    });
  }

  return recs;
}

function getLinkRecommendations(input: RecommendationInput): Omit<Recommendation, 'id'>[] {
  const recs: Omit<Recommendation, 'id'>[] = [];

  if (input.internalLinks !== undefined) {
    if (input.internalLinks < 3) {
      recs.push({
        category: 'links',
        severity: 'warning',
        title: SEO_RECOMMENDATIONS.INTERNAL_LINKS_FEW.title,
        description: SEO_RECOMMENDATIONS.INTERNAL_LINKS_FEW.description(input.internalLinks),
        action: SEO_RECOMMENDATIONS.INTERNAL_LINKS_FEW.action,
        priority: 4,
      });
    } else {
      recs.push({
        category: 'links',
        severity: 'info',
        title: SEO_RECOMMENDATIONS.INTERNAL_LINKS_OK.title,
        description: SEO_RECOMMENDATIONS.INTERNAL_LINKS_OK.description(input.internalLinks),
        action: SEO_RECOMMENDATIONS.INTERNAL_LINKS_OK.action,
        priority: 1,
      });
    }
  }

  if (input.externalLinks !== undefined) {
    if (input.externalLinks === 0) {
      recs.push({
        category: 'links',
        severity: 'info',
        title: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_NONE.title,
        description: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_NONE.description,
        action: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_NONE.action,
        priority: 2,
      });
    } else {
      recs.push({
        category: 'links',
        severity: 'info',
        title: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_OK.title,
        description: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_OK.description(input.externalLinks),
        action: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_OK.action,
        priority: 1,
      });
    }
  }

  return recs;
}

function getIssueRecommendations(
  validation: ValidationResult,
  category: Recommendation['category'],
  title: string,
  action: string
): Omit<Recommendation, 'id'>[] {
  const recs: Omit<Recommendation, 'id'>[] = [];

  if (validation.issues.length > 0) {
    validation.issues.forEach((issue) => {
      recs.push({
        category,
        severity: 'critical',
        title: `${title} Issue`,
        description: issue,
        action,
        priority: 9,
      });
    });
  } else if (validation.warnings.length > 0) {
    validation.warnings.forEach((warning) => {
      recs.push({
        category,
        severity: 'warning',
        title: `${title} Warning`,
        description: warning,
        action,
        priority: 5,
      });
    });
  } else if (validation.isValid && validation.score >= 80) {
    recs.push({
      category,
      severity: 'info',
      title: `${title} OK`,
      description: SEO_RECOMMENDATIONS.GENERIC_OK.description(title, validation.score),
      action: SEO_RECOMMENDATIONS.GENERIC_OK.action,
      priority: 1,
    });
  }

  return recs;
}
