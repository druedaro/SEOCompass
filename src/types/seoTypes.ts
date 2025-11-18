export interface ParsedMetadata {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  author: string | null;
  language: string | null;
  viewport: string | null;
}

export interface ParsedHeading {
  level: number;
  text: string;
  id?: string;
}

export interface ParsedImage {
  src: string;
  alt: string | null;
  title: string | null;
  width?: number;
  height?: number;
}

export interface ParsedLink {
  href: string;
  text: string;
  rel: string | null;
  target: string | null;
  isInternal: boolean;
  isExternal: boolean;
}

export interface ParsedContent {
  metadata: ParsedMetadata;
  headings: ParsedHeading[];
  images: ParsedImage[];
  links: ParsedLink[];
  hreflangTags: Array<{ hreflang: string; href: string }>;
  bodyText: string;
  wordCount: number;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  score: number;
}

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
  internalLinks?: number;
  externalLinks?: number;
}

export interface Recommendation {
  id: string;
  category: 'meta' | 'content' | 'technical' | 'links' | 'images';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action: string;
  priority: number;
}
