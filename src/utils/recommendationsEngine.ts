/**
 * Recommendations Engine
 * Generate actionable SEO recommendations based on detected issues
 */

import type { ValidationResult } from './validators';

export interface Recommendation {
  id: string;
  category: 'meta' | 'content' | 'technical' | 'links' | 'images' | 'keywords';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action: string;
  priority: number; // 1-10, higher is more important
}

/**
 * Generate recommendations from title validation
 */
function getTitleRecommendations(validation: ValidationResult, title: string | null): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!title || title.trim().length === 0) {
    recommendations.push({
      id: 'title-missing',
      category: 'meta',
      severity: 'critical',
      title: 'Missing Title Tag',
      description: 'Your page is missing a title tag, which is crucial for SEO and user experience.',
      action: 'Add a descriptive title tag (50-60 characters) that includes your target keyword.',
      priority: 10,
    });
    return recommendations;
  }

  validation.issues.forEach((issue) => {
    if (issue.includes('too short')) {
      recommendations.push({
        id: 'title-short',
        category: 'meta',
        severity: 'critical',
        title: 'Title Tag Too Short',
        description: issue,
        action: 'Expand your title to 50-60 characters for better visibility in search results.',
        priority: 8,
      });
    } else if (issue.includes('too long')) {
      recommendations.push({
        id: 'title-long',
        category: 'meta',
        severity: 'critical',
        title: 'Title Tag Too Long',
        description: issue,
        action: 'Shorten your title to 60 characters or less to avoid truncation in search results.',
        priority: 8,
      });
    }
  });

  validation.warnings.forEach((warning) => {
    if (warning.includes('could be longer')) {
      recommendations.push({
        id: 'title-optimize',
        category: 'meta',
        severity: 'warning',
        title: 'Optimize Title Length',
        description: warning,
        action: 'Consider expanding your title closer to the optimal 50-60 character range.',
        priority: 5,
      });
    } else if (warning.includes('generic')) {
      recommendations.push({
        id: 'title-generic',
        category: 'meta',
        severity: 'warning',
        title: 'Generic Title Detected',
        description: 'Your title appears generic and may not effectively communicate your page content.',
        action: 'Create a unique, descriptive title that accurately represents your page content.',
        priority: 7,
      });
    }
  });

  return recommendations;
}

/**
 * Generate recommendations from description validation
 */
function getDescriptionRecommendations(validation: ValidationResult, description: string | null): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!description || description.trim().length === 0) {
    recommendations.push({
      id: 'description-missing',
      category: 'meta',
      severity: 'critical',
      title: 'Missing Meta Description',
      description: 'Your page lacks a meta description, which affects click-through rates from search results.',
      action: 'Add a compelling meta description (150-160 characters) that summarizes your page content.',
      priority: 9,
    });
    return recommendations;
  }

  validation.issues.forEach((issue) => {
    if (issue.includes('too short')) {
      recommendations.push({
        id: 'description-short',
        category: 'meta',
        severity: 'warning',
        title: 'Meta Description Too Short',
        description: issue,
        action: 'Expand your meta description to 150-160 characters for better visibility.',
        priority: 7,
      });
    } else if (issue.includes('too long')) {
      recommendations.push({
        id: 'description-long',
        category: 'meta',
        severity: 'warning',
        title: 'Meta Description Too Long',
        description: issue,
        action: 'Shorten your meta description to 160 characters to avoid truncation.',
        priority: 7,
      });
    }
  });

  return recommendations;
}

/**
 * Generate recommendations from H1 validation
 */
function getH1Recommendations(validation: ValidationResult, h1s: string[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (h1s.length === 0) {
    recommendations.push({
      id: 'h1-missing',
      category: 'content',
      severity: 'critical',
      title: 'Missing H1 Heading',
      description: 'Your page has no H1 heading, which is important for SEO and accessibility.',
      action: 'Add a single H1 heading that clearly describes the main topic of the page.',
      priority: 9,
    });
  } else if (h1s.length > 1) {
    recommendations.push({
      id: 'h1-multiple',
      category: 'content',
      severity: 'critical',
      title: 'Multiple H1 Headings',
      description: `Found ${h1s.length} H1 headings. Use only one H1 per page.`,
      action: 'Keep only one H1 heading and convert others to H2 or H3 as appropriate.',
      priority: 8,
    });
  }

  validation.warnings.forEach((warning) => {
    if (warning.includes('too long')) {
      recommendations.push({
        id: 'h1-long',
        category: 'content',
        severity: 'info',
        title: 'H1 Heading Too Long',
        description: warning,
        action: 'Consider shortening your H1 to under 70 characters for better readability.',
        priority: 4,
      });
    } else if (warning.includes('very short')) {
      recommendations.push({
        id: 'h1-short',
        category: 'content',
        severity: 'info',
        title: 'H1 Heading Too Short',
        description: warning,
        action: 'Make your H1 more descriptive to better communicate page content.',
        priority: 5,
      });
    }
  });

  return recommendations;
}

/**
 * Generate recommendations from images validation
 */
function getImageRecommendations(
  validation: ValidationResult,
  images: Array<{ src: string; alt: string | null }>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const imagesWithoutAlt = images.filter((img) => !img.alt || img.alt.trim() === '');

  if (imagesWithoutAlt.length > 0) {
    recommendations.push({
      id: 'images-missing-alt',
      category: 'images',
      severity: 'critical',
      title: `${imagesWithoutAlt.length} Images Missing Alt Text`,
      description: 'Images without alt text harm accessibility and SEO.',
      action: 'Add descriptive alt text to all images, including target keywords where relevant.',
      priority: 8,
    });
  }

  return recommendations;
}

/**
 * Generate recommendations from content length validation
 */
function getContentLengthRecommendations(
  _validation: ValidationResult,
  wordCount: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (wordCount < 300) {
    recommendations.push({
      id: 'content-thin',
      category: 'content',
      severity: wordCount < 100 ? 'critical' : 'warning',
      title: 'Thin Content',
      description: `Page has only ${wordCount} words. Content-rich pages typically rank better.`,
      action: 'Expand your content to at least 300 words with valuable, relevant information.',
      priority: wordCount < 100 ? 9 : 6,
    });
  }

  return recommendations;
}

/**
 * Generate recommendations from heading hierarchy
 */
function getHeadingHierarchyRecommendations(
  validation: ValidationResult
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  validation.warnings.forEach((warning) => {
    if (warning.includes('skips')) {
      recommendations.push({
        id: 'heading-hierarchy',
        category: 'content',
        severity: 'warning',
        title: 'Broken Heading Hierarchy',
        description: warning,
        action: 'Fix heading structure to follow proper hierarchy (H1 → H2 → H3, etc.).',
        priority: 5,
      });
    }
  });

  return recommendations;
}

/**
 * Generate recommendations from URL validation
 */
function getUrlRecommendations(validation: ValidationResult): Recommendation[] {
  const recommendations: Recommendation[] = [];

  validation.warnings.forEach((warning) => {
    if (warning.includes('underscores')) {
      recommendations.push({
        id: 'url-underscores',
        category: 'technical',
        severity: 'info',
        title: 'URL Contains Underscores',
        description: warning,
        action: 'Use hyphens (-) instead of underscores (_) in URLs for better SEO.',
        priority: 3,
      });
    } else if (warning.includes('uppercase')) {
      recommendations.push({
        id: 'url-uppercase',
        category: 'technical',
        severity: 'info',
        title: 'URL Contains Uppercase Letters',
        description: warning,
        action: 'Convert all URL characters to lowercase for consistency.',
        priority: 3,
      });
    } else if (warning.includes('stop words')) {
      recommendations.push({
        id: 'url-stopwords',
        category: 'technical',
        severity: 'info',
        title: 'URL Contains Stop Words',
        description: warning,
        action: 'Remove stop words (and, or, the, etc.) from URLs for cleaner structure.',
        priority: 2,
      });
    }
  });

  return recommendations;
}

/**
 * Generate recommendations for structured data
 */
function getStructuredDataRecommendations(hasStructuredData: boolean): Recommendation[] {
  if (hasStructuredData) return [];

  return [
    {
      id: 'structured-data-missing',
      category: 'technical',
      severity: 'warning',
      title: 'Missing Structured Data',
      description: 'No schema markup detected. Structured data helps search engines understand your content.',
      action: 'Add appropriate schema.org markup (e.g., Article, Product, Organization) to enhance search visibility.',
      priority: 6,
    },
  ];
}

/**
 * Generate recommendations for links
 */
function getLinkRecommendations(internalLinks: number, externalLinks: number): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (internalLinks === 0) {
    recommendations.push({
      id: 'links-no-internal',
      category: 'links',
      severity: 'warning',
      title: 'No Internal Links',
      description: 'Page has no internal links to other pages on your site.',
      action: 'Add 3-5 relevant internal links to improve site structure and SEO.',
      priority: 7,
    });
  } else if (internalLinks < 3) {
    recommendations.push({
      id: 'links-few-internal',
      category: 'links',
      severity: 'info',
      title: 'Few Internal Links',
      description: `Page has only ${internalLinks} internal link(s).`,
      action: 'Consider adding more internal links to related content.',
      priority: 4,
    });
  }

  if (externalLinks === 0) {
    recommendations.push({
      id: 'links-no-external',
      category: 'links',
      severity: 'info',
      title: 'No External Links',
      description: 'Page has no links to external resources.',
      action: 'Consider linking to relevant, authoritative external sources to add value.',
      priority: 3,
    });
  }

  return recommendations;
}

/**
 * Generate recommendations for keyword optimization
 */
function getKeywordRecommendations(
  focusKeyword: {
    inTitle: boolean;
    inDescription: boolean;
    inH1: boolean;
    inUrl: boolean;
    density: number;
  } | undefined
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!focusKeyword) return recommendations;

  if (!focusKeyword.inTitle) {
    recommendations.push({
      id: 'keyword-not-in-title',
      category: 'keywords',
      severity: 'critical',
      title: 'Focus Keyword Not in Title',
      description: 'Your target keyword is not present in the title tag.',
      action: 'Include your focus keyword in the title tag, preferably near the beginning.',
      priority: 9,
    });
  }

  if (!focusKeyword.inDescription) {
    recommendations.push({
      id: 'keyword-not-in-description',
      category: 'keywords',
      severity: 'warning',
      title: 'Focus Keyword Not in Meta Description',
      description: 'Your target keyword is not present in the meta description.',
      action: 'Include your focus keyword naturally in the meta description.',
      priority: 7,
    });
  }

  if (!focusKeyword.inH1) {
    recommendations.push({
      id: 'keyword-not-in-h1',
      category: 'keywords',
      severity: 'warning',
      title: 'Focus Keyword Not in H1',
      description: 'Your target keyword is not present in the H1 heading.',
      action: 'Include your focus keyword in the H1 heading.',
      priority: 8,
    });
  }

  if (focusKeyword.density < 0.5) {
    recommendations.push({
      id: 'keyword-density-low',
      category: 'keywords',
      severity: 'warning',
      title: 'Low Keyword Density',
      description: `Keyword density is ${focusKeyword.density.toFixed(2)}%, which may be too low.`,
      action: 'Use your focus keyword more naturally throughout the content (aim for 1-2.5%).',
      priority: 6,
    });
  } else if (focusKeyword.density > 3.5) {
    recommendations.push({
      id: 'keyword-stuffing',
      category: 'keywords',
      severity: 'critical',
      title: 'Keyword Stuffing Detected',
      description: `Keyword density is ${focusKeyword.density.toFixed(2)}%, which is excessively high.`,
      action: 'Reduce keyword usage to avoid keyword stuffing penalties (aim for 1-2.5%).',
      priority: 9,
    });
  }

  return recommendations;
}

/**
 * Generate all recommendations from validation inputs
 */
export function generateRecommendations(input: {
  titleValidation: ValidationResult;
  title: string | null;
  descriptionValidation: ValidationResult;
  description: string | null;
  urlValidation: ValidationResult;
  h1Validation: ValidationResult;
  h1s: string[];
  headingHierarchyValidation: ValidationResult;
  imagesValidation: ValidationResult;
  images: Array<{ src: string; alt: string | null }>;
  contentLengthValidation: ValidationResult;
  wordCount: number;
  hasStructuredData?: boolean;
  internalLinks?: number;
  externalLinks?: number;
  focusKeyword?: {
    inTitle: boolean;
    inDescription: boolean;
    inH1: boolean;
    inUrl: boolean;
    density: number;
  };
}): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Gather all recommendations
  recommendations.push(...getTitleRecommendations(input.titleValidation, input.title));
  recommendations.push(...getDescriptionRecommendations(input.descriptionValidation, input.description));
  recommendations.push(...getH1Recommendations(input.h1Validation, input.h1s));
  recommendations.push(...getImageRecommendations(input.imagesValidation, input.images));
  recommendations.push(...getContentLengthRecommendations(input.contentLengthValidation, input.wordCount));
  recommendations.push(...getHeadingHierarchyRecommendations(input.headingHierarchyValidation));
  recommendations.push(...getUrlRecommendations(input.urlValidation));

  if (input.hasStructuredData !== undefined) {
    recommendations.push(...getStructuredDataRecommendations(input.hasStructuredData));
  }

  if (input.internalLinks !== undefined && input.externalLinks !== undefined) {
    recommendations.push(...getLinkRecommendations(input.internalLinks, input.externalLinks));
  }

  if (input.focusKeyword) {
    recommendations.push(...getKeywordRecommendations(input.focusKeyword));
  }

  // Sort by priority (highest first)
  recommendations.sort((a, b) => b.priority - a.priority);

  return recommendations;
}
