import type { ValidationResult } from './seoTypes';

export interface ValidationResults {
  titleValidation: ValidationResult;
  descriptionValidation: ValidationResult;
  urlValidation: ValidationResult;
  h1Validation: ValidationResult;
  headingHierarchyValidation: ValidationResult;
  imagesValidation: ValidationResult;
  contentLengthValidation: ValidationResult;
  canonicalValidation: ValidationResult;
  linksValidation: ValidationResult;
  hreflangValidation: ValidationResult;
  robotsValidation: ValidationResult;
  internalLinks: number;
  externalLinks: number;
}
