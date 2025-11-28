import { scrapeByProjectUrlId } from '@/services/contentScraping/contentScrapingService';
import { parseHTMLContent, extractH1Texts, countLinks } from '@/features/seo/htmlParser/htmlParser';
import {
  validateTitle,
  validateDescription,
  validateUrl,
  validateH1,
  validateHeadingHierarchy,
  validateImages,
  validateContentLength,
  validateCanonical,
  validateLinks,
  validateHreflang,
  validateRobotsMeta,
  validateHttpStatus,
} from '@/features/seo/validators/validators';
import { calculateSEOScore } from '@/features/seo/scoreCalculator/scoreCalculator';
import { generateRecommendations } from '@/features/seo/recommendationsEngine/recommendationsEngine';
import type { ScrapedContent } from '@/types/audit';
import type { ParsedContent, ValidationResults } from '@/types/seoTypes';
import type { SEOScoreBreakdown, Recommendation } from '@/types/seoTypes';

export interface AuditResult {
  scores: SEOScoreBreakdown;
  recommendations: Recommendation[];
  url: string;
}

export class AuditOrchestrator {
  async runAudit(projectUrlId: string): Promise<AuditResult> {
    const scrapedContent = await this.scrapeContent(projectUrlId);
    const parsedContent = this.parseContent(scrapedContent);
    const validations = this.validateContent(parsedContent, scrapedContent);
    const scores = this.calculateScores(validations, parsedContent);
    const recommendations = this.generateRecommendations(validations, parsedContent, scrapedContent);

    return {
      scores,
      recommendations,
      url: scrapedContent.finalUrl,
    };
  }

  private async scrapeContent(projectUrlId: string): Promise<ScrapedContent> {
    return await scrapeByProjectUrlId(projectUrlId);
  }

  private parseContent(scrapedContent: ScrapedContent): ParsedContent {
    return parseHTMLContent(scrapedContent.html, scrapedContent.finalUrl);
  }

  private validateContent(
    parsedContent: ParsedContent,
    scrapedContent: ScrapedContent
  ): ValidationResults {
    const h1s = extractH1Texts(parsedContent);
    const { internal: internalLinks, external: externalLinks } = countLinks(parsedContent);

    return {
      titleValidation: validateTitle(parsedContent.metadata.title),
      descriptionValidation: validateDescription(parsedContent.metadata.description),
      urlValidation: validateUrl(scrapedContent.finalUrl),
      h1Validation: validateH1(h1s),
      headingHierarchyValidation: validateHeadingHierarchy(parsedContent.headings),
      imagesValidation: validateImages(parsedContent.images),
      contentLengthValidation: validateContentLength(parsedContent.wordCount),
      canonicalValidation: validateCanonical(
        parsedContent.metadata.canonicalUrl,
        scrapedContent.finalUrl
      ),
      linksValidation: validateLinks({ internal: internalLinks, external: externalLinks }),
      hreflangValidation: validateHreflang(parsedContent.hreflangTags),
      robotsValidation: validateRobotsMeta(parsedContent.metadata.robots),
      internalLinks,
      externalLinks,
    };
  }

  private calculateScores(
    validations: ValidationResults,
    parsedContent: ParsedContent
  ): SEOScoreBreakdown {
    return calculateSEOScore({
      ...validations,
      hasStructuredData: parsedContent.hasStructuredData,
    });
  }

  private generateRecommendations(
    validations: ValidationResults,
    parsedContent: ParsedContent,
    scrapedContent: ScrapedContent
  ): Recommendation[] {
    const h1s = extractH1Texts(parsedContent);
    const errors = validateHttpStatus(scrapedContent);

    return generateRecommendations({
      titleValidation: validations.titleValidation,
      title: parsedContent.metadata.title,
      descriptionValidation: validations.descriptionValidation,
      description: parsedContent.metadata.description,
      urlValidation: validations.urlValidation,
      h1Validation: validations.h1Validation,
      h1s,
      headingHierarchyValidation: validations.headingHierarchyValidation,
      imagesValidation: validations.imagesValidation,
      images: parsedContent.images,
      contentLengthValidation: validations.contentLengthValidation,
      wordCount: parsedContent.wordCount,
      canonicalValidation: validations.canonicalValidation,
      robotsValidation: validations.robotsValidation,
      hasStructuredData: parsedContent.hasStructuredData,
      internalLinks: validations.internalLinks,
      externalLinks: validations.externalLinks,
      has404Error: errors.has404,
      hasServerError: errors.hasServer,
    });
  }
}
