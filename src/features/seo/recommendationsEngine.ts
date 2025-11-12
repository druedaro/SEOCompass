import type { ValidationResult } from './validators';

export interface Recommendation {
  id: string;
  category: 'meta' | 'content' | 'technical' | 'links' | 'images';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action: string;
  priority: number;
}

interface RecommendationInput {
  titleValidation: ValidationResult;
  title?: string | null;
  descriptionValidation: ValidationResult;
  description?: string | null;
  urlValidation: ValidationResult;
  h1Validation: ValidationResult;
  h1s?: string[];
  headingHierarchyValidation: ValidationResult;
  imagesValidation: ValidationResult;
  images?: Array<{ src: string; alt: string | null }>;
  contentLengthValidation: ValidationResult;
  wordCount?: number;
  canonicalValidation?: ValidationResult;
  robotsValidation?: ValidationResult;
  hasStructuredData?: boolean;
  internalLinks?: number;
  externalLinks?: number;
  has404Error?: boolean;
  hasServerError?: boolean;
}

export function generateRecommendations(input: RecommendationInput): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let counter = 0;

  if (input.has404Error) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'critical',
      title: '404 Error - Page Not Found',
      description: 'This page returns a 404 error.',
      action: 'Fix the URL or restore the page content immediately.',
      priority: 10,
    });
  }

  if (input.hasServerError) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'critical',
      title: 'Server Error (5xx)',
      description: 'This page is returning a server error.',
      action: 'Check server configuration and logs.',
      priority: 10,
    });
  }

  counter = addIssueRecommendations(
    recommendations,
    input.titleValidation,
    'meta',
    'Title Tag',
    'Add a descriptive title (50-60 chars) with your main topic.',
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.descriptionValidation,
    'meta',
    'Meta Description',
    'Write a compelling description (150-160 chars) summarizing the page.',
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.urlValidation,
    'technical',
    'URL Structure',
    'Use lowercase, hyphens, and remove special characters/stop words.',
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.h1Validation,
    'content',
    'H1 Heading',
    input.h1s && input.h1s.length > 1
      ? 'Use only one H1 heading per page.'
      : 'Add a single H1 heading describing the page topic.',
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.headingHierarchyValidation,
    'content',
    'Heading Hierarchy',
    'Follow proper heading order (H1 → H2 → H3) without skipping levels.',
    counter
  );

  counter = addIssueRecommendations(
    recommendations,
    input.contentLengthValidation,
    'content',
    'Content Length',
    `Expand content to at least 300 words (current: ${input.wordCount || 0}).`,
    counter
  );

  if (input.canonicalValidation) {
    counter = addIssueRecommendations(
      recommendations,
      input.canonicalValidation,
      'technical',
      'Canonical Tag',
      'Add or fix canonical tag to avoid duplicate content issues.',
      counter
    );
  } else {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'critical',
      title: 'Missing Canonical Tag',
      description: 'No canonical URL specified.',
      action: 'Add a canonical tag to this page.',
      priority: 10,
    });
  }

  if (input.robotsValidation) {
    counter = addIssueRecommendations(
      recommendations,
      input.robotsValidation,
      'technical',
      'Robots Meta Tag',
      'Review robots meta tag settings.',
      counter
    );
  }

  if (input.imagesValidation.issues.length > 0) {
    const missingAlt = input.imagesValidation.issues[0];
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'images',
      severity: 'warning',
      title: 'Missing Image Alt Text',
      description: missingAlt,
      action: 'Add descriptive alt text to all images for SEO and accessibility.',
      priority: 6,
    });
  } else if (input.imagesValidation.isValid) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'images',
      severity: 'info',
      title: 'Images OK',
      description: `All images have alt text (Score: ${input.imagesValidation.score}/100).`,
      action: 'No action needed.',
      priority: 1,
    });
  }

  if (!input.hasStructuredData) {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'warning',
      title: 'No Structured Data',
      description: 'Page lacks structured data (Schema.org).',
      action: 'Add JSON-LD structured data matching your content type.',
      priority: 5,
    });
  } else {
    recommendations.push({
      id: `rec-${counter++}`,
      category: 'technical',
      severity: 'info',
      title: 'Structured Data Present',
      description: 'Page has structured data configured.',
      action: 'No action needed.',
      priority: 1,
    });
  }

  if (input.internalLinks !== undefined) {
    if (input.internalLinks < 3) {
      recommendations.push({
        id: `rec-${counter++}`,
        category: 'links',
        severity: 'warning',
        title: 'Few Internal Links',
        description: `Only ${input.internalLinks} internal links found.`,
        action: 'Add more internal links to related content on your site.',
        priority: 4,
      });
    } else {
      recommendations.push({
        id: `rec-${counter++}`,
        category: 'links',
        severity: 'info',
        title: 'Internal Links OK',
        description: `${input.internalLinks} internal links found.`,
        action: 'Good internal linking structure.',
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
        title: 'No External Links',
        description: 'No external links detected.',
        action: 'Consider linking to authoritative external sources.',
        priority: 2,
      });
    } else {
      recommendations.push({
        id: `rec-${counter++}`,
        category: 'links',
        severity: 'info',
        title: 'External Links Present',
        description: `${input.externalLinks} external links found.`,
        action: 'Good use of external references.',
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
      description: `${title} is properly configured (Score: ${validation.score}/100).`,
      action: 'No action needed.',
      priority: 1,
    });
  }

  return counter;
}
