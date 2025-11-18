import type { ValidationResult, Recommendation, RecommendationInput } from '@/types/seoTypes';
import { SEO_RECOMMENDATIONS } from '@/constants/seo';

export type { Recommendation };

export function generateRecommendations(input: RecommendationInput): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let counter = 0;

  if (input.has404Error) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'critical',
      title: SEO_RECOMMENDATIONS.ERROR_404.title,
      description: SEO_RECOMMENDATIONS.ERROR_404.description,
      action: SEO_RECOMMENDATIONS.ERROR_404.action,
      priority: 10,
    });
  }

  if (input.hasServerError) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'critical',
      title: SEO_RECOMMENDATIONS.ERROR_5XX.title,
      description: SEO_RECOMMENDATIONS.ERROR_5XX.description,
      action: SEO_RECOMMENDATIONS.ERROR_5XX.action,
      priority: 10,
    });
  }

  counter = addIssueRecommendations(
    recommendations,
    input.titleValidation,
    'meta',
    SEO_RECOMMENDATIONS.TITLE.title,
    SEO_RECOMMENDATIONS.TITLE.action,
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.descriptionValidation,
    'meta',
    SEO_RECOMMENDATIONS.DESCRIPTION.title,
    SEO_RECOMMENDATIONS.DESCRIPTION.action,
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.urlValidation,
    'technical',
    SEO_RECOMMENDATIONS.URL.title,
    SEO_RECOMMENDATIONS.URL.action,
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.h1Validation,
    'content',
    SEO_RECOMMENDATIONS.H1_SINGLE.title,
    input.h1s && input.h1s.length > 1
      ? SEO_RECOMMENDATIONS.H1_MULTIPLE.action
      : SEO_RECOMMENDATIONS.H1_SINGLE.action,
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.headingHierarchyValidation,
    'content',
    SEO_RECOMMENDATIONS.HEADING_HIERARCHY.title,
    SEO_RECOMMENDATIONS.HEADING_HIERARCHY.action,
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.contentLengthValidation,
    'content',
    SEO_RECOMMENDATIONS.CONTENT_LENGTH.title,
    SEO_RECOMMENDATIONS.CONTENT_LENGTH.action(input.wordCount || 0),
    counter
  );

  if (input.canonicalValidation) {
    counter = addIssueRecommendations(
      recommendations,
      input.canonicalValidation,
      'technical',
      SEO_RECOMMENDATIONS.CANONICAL.title,
      SEO_RECOMMENDATIONS.CANONICAL.action,
      counter
    );
  } else {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'critical',
      title: SEO_RECOMMENDATIONS.CANONICAL_MISSING.title,
      description: SEO_RECOMMENDATIONS.CANONICAL_MISSING.description,
      action: SEO_RECOMMENDATIONS.CANONICAL_MISSING.action,
      priority: 10,
    });
  }

  if (input.robotsValidation) {
    counter = addIssueRecommendations(
      recommendations,
      input.robotsValidation,
      'technical',
      SEO_RECOMMENDATIONS.ROBOTS.title,
      SEO_RECOMMENDATIONS.ROBOTS.action,
      counter
    );
  }

  if (input.imagesValidation.issues.length > 0) {
    const missingAlt = input.imagesValidation.issues[0];
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'images',
      severity: 'warning',
      title: SEO_RECOMMENDATIONS.IMAGES_ALT.title,
      description: missingAlt,
      action: SEO_RECOMMENDATIONS.IMAGES_ALT.action,
      priority: 6,
    });
  } else if (input.imagesValidation.isValid) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'images',
      severity: 'info',
      title: SEO_RECOMMENDATIONS.IMAGES_OK.title,
      description: SEO_RECOMMENDATIONS.IMAGES_OK.description(input.imagesValidation.score),
      action: SEO_RECOMMENDATIONS.IMAGES_OK.action,
      priority: 1,
    });
  }

  if (!input.hasStructuredData) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'warning',
      title: SEO_RECOMMENDATIONS.STRUCTURED_DATA_MISSING.title,
      description: SEO_RECOMMENDATIONS.STRUCTURED_DATA_MISSING.description,
      action: SEO_RECOMMENDATIONS.STRUCTURED_DATA_MISSING.action,
      priority: 5,
    });
  } else {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'info',
      title: SEO_RECOMMENDATIONS.STRUCTURED_DATA_OK.title,
      description: SEO_RECOMMENDATIONS.STRUCTURED_DATA_OK.description,
      action: SEO_RECOMMENDATIONS.STRUCTURED_DATA_OK.action,
      priority: 1,
    });
  }

  if (input.internalLinks !== undefined) {
    if (input.internalLinks < 3) {
      recommendations.push({
        id: `rec-${counter++}`,
        category: 'links',
        severity: 'warning',
        title: SEO_RECOMMENDATIONS.INTERNAL_LINKS_FEW.title,
        description: SEO_RECOMMENDATIONS.INTERNAL_LINKS_FEW.description(input.internalLinks),
        action: SEO_RECOMMENDATIONS.INTERNAL_LINKS_FEW.action,
        priority: 4,
      });
    } else {
      recommendations.push({
        id: `rec-${counter++}`,
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
      recommendations.push({
        id: `rec-${counter++}`,
        category: 'links',
        severity: 'info',
        title: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_NONE.title,
        description: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_NONE.description,
        action: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_NONE.action,
        priority: 2,
      });
    } else {
      recommendations.push({
        id: `rec-${counter++}`,
        category: 'links',
        severity: 'info',
        title: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_OK.title,
        description: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_OK.description(input.externalLinks),
        action: SEO_RECOMMENDATIONS.EXTERNAL_LINKS_OK.action,
        priority: 1,
      });
    }
  }

  return recommendations.sort((a, b) => b.priority - a.priority);
}

function addIssueRecommendations(
  recommendations: Recommendation[],
  validation: ValidationResult,
  category: Recommendation['category'],
  title: string,
  action: string,
  startCounter: number
): number {
  let counter = startCounter;

  if (validation.issues.length > 0) {
    validation.issues.forEach((issue) => {
      recommendations.push({
        id: `rec-${counter++}`,
        category,
        severity: 'critical',
        title: `${title} Issue`,
        description: issue,
        action,
        priority: 9,
      });
    });
  }
  else if (validation.warnings.length > 0) {
    validation.warnings.forEach((warning) => {
      recommendations.push({
        id: `rec-${counter++}`,
        category,
        severity: 'warning',
        title: `${title} Warning`,
        description: warning,
        action,
        priority: 5,
      });
    });
  }
  else if (validation.isValid && validation.score >= 80) {
    recommendations.push({
      id: `rec-${counter++}`,
      category,
      severity: 'info',
      title: `${title} OK`,
      description: SEO_RECOMMENDATIONS.GENERIC_OK.description(title, validation.score),
      action: SEO_RECOMMENDATIONS.GENERIC_OK.action,
      priority: 1,
    });
  }

  return counter;
}
