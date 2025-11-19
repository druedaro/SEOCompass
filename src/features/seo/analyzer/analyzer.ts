import { parseHTMLContent, type ParsedContent } from '../htmlParser/htmlParser';
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
} from '../validators/validators';
import { calculateSEOScore, type SEOScoreBreakdown } from '../scoreCalculator/scoreCalculator';
import { generateRecommendations, type Recommendation } from '../recommendationsEngine/recommendationsEngine';
import type { ScrapedContent } from '@/services/contentScraping/contentScrapingService';
import type { ValidationResults } from '@/types/hooks';

export interface AnalysisResult {
    parsedContent: ParsedContent;
    validations: ValidationResults;
    scores: SEOScoreBreakdown;
    recommendations: Recommendation[];
    h1s: string[];
    errors: { has404: boolean; hasServer: boolean };
}

function extractH1Texts(parsedContent: ParsedContent): string[] {
    return parsedContent.headings
        .filter((h) => h.level === 1)
        .map((h) => h.text);
}

function countLinks(parsedContent: ParsedContent): { internal: number; external: number } {
    const internal = parsedContent.links.filter((link) => link.isInternal).length;
    const external = parsedContent.links.filter((link) => link.isExternal).length;
    return { internal, external };
}

function checkErrors(scrapedContent: ScrapedContent): { has404: boolean; hasServer: boolean } {
    return {
        has404: scrapedContent.statusCode === 404,
        hasServer: scrapedContent.statusCode >= 500,
    };
}

function performValidations(
    parsedContent: ParsedContent,
    scrapedContent: ScrapedContent,
    h1s: string[]
): ValidationResults {
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

function computeScores(
    validations: ValidationResults,
    parsedContent: ParsedContent
): SEOScoreBreakdown {
    return calculateSEOScore({
        ...validations,
        hasStructuredData: parsedContent.hasStructuredData,
    });
}

function buildRecommendations(
    validations: ValidationResults,
    parsedContent: ParsedContent,
    h1s: string[],
    errors: { has404: boolean; hasServer: boolean }
): Recommendation[] {
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

export function analyzeContent(scrapedContent: ScrapedContent): AnalysisResult {
    const parsedContent = parseHTMLContent(scrapedContent.html, scrapedContent.finalUrl);

    const h1s = extractH1Texts(parsedContent);
    const errors = checkErrors(scrapedContent);
    const validations = performValidations(parsedContent, scrapedContent, h1s);
    const scores = computeScores(validations, parsedContent);
    const recommendations = buildRecommendations(validations, parsedContent, h1s, errors);

    return {
        parsedContent,
        validations,
        scores,
        recommendations,
        h1s,
        errors
    };
}
