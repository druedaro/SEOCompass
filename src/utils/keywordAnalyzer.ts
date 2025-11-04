/**
 * Keyword Analysis Utilities
 * Analyze keyword density, distribution, and prominence in content
 */

export interface KeywordMetrics {
  keyword: string;
  count: number;
  density: number; // percentage
  prominence: number; // 0-100 score based on location
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inFirstParagraph: boolean;
  inUrl: boolean;
}

export interface KeywordAnalysisResult {
  totalWords: number;
  uniqueWords: number;
  keywords: KeywordMetrics[];
  topKeywords: KeywordMetrics[];
  focusKeyword?: KeywordMetrics;
}

/**
 * Remove stop words from text for better keyword analysis
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'you', 'your', 'this', 'but', 'they',
  'have', 'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how',
  'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no',
  'por', 'con', 'su', 'para', 'como', 'es', 'lo', 'al', 'del',
]);

/**
 * Normalize text for keyword analysis
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, ' ') // Keep Spanish characters
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract words from text, filtering stop words
 */
function extractWords(text: string, includeStopWords = false): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter((word) => word.length > 2);

  if (includeStopWords) {
    return words;
  }

  return words.filter((word) => !STOP_WORDS.has(word));
}

/**
 * Count word frequency in text
 */
function countWordFrequency(words: string[]): Map<string, number> {
  const frequency = new Map<string, number>();

  words.forEach((word) => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  return frequency;
}

/**
 * Calculate keyword density
 */
function calculateDensity(count: number, totalWords: number): number {
  if (totalWords === 0) return 0;
  return (count / totalWords) * 100;
}

/**
 * Calculate keyword prominence based on locations
 */
function calculateProminence(metrics: {
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inFirstParagraph: boolean;
  inUrl: boolean;
}): number {
  let score = 0;

  if (metrics.inTitle) score += 30;
  if (metrics.inDescription) score += 20;
  if (metrics.inH1) score += 20;
  if (metrics.inFirstParagraph) score += 15;
  if (metrics.inUrl) score += 15;

  return score;
}

/**
 * Check if keyword appears in text
 */
function containsKeyword(text: string | null | undefined, keyword: string): boolean {
  if (!text) return false;
  return normalizeText(text).includes(keyword);
}

/**
 * Analyze single keyword across different content sections
 */
export function analyzeKeyword(
  keyword: string,
  content: {
    title?: string | null;
    description?: string | null;
    h1s?: string[];
    bodyText: string;
    url?: string;
  },
  totalWords: number
): KeywordMetrics {
  const normalizedKeyword = normalizeText(keyword);
  const normalizedBody = normalizeText(content.bodyText);

  // Count occurrences
  const regex = new RegExp(`\\b${normalizedKeyword}\\b`, 'g');
  const matches = normalizedBody.match(regex);
  const count = matches ? matches.length : 0;

  // Check locations
  const inTitle = containsKeyword(content.title, normalizedKeyword);
  const inDescription = containsKeyword(content.description, normalizedKeyword);
  const inH1 = content.h1s?.some((h1) => containsKeyword(h1, normalizedKeyword)) || false;
  const firstParagraph = content.bodyText.split('\n')[0] || '';
  const inFirstParagraph = containsKeyword(firstParagraph, normalizedKeyword);
  const inUrl = containsKeyword(content.url, normalizedKeyword);

  const prominence = calculateProminence({
    inTitle,
    inDescription,
    inH1,
    inFirstParagraph,
    inUrl,
  });

  return {
    keyword,
    count,
    density: calculateDensity(count, totalWords),
    prominence,
    inTitle,
    inDescription,
    inH1,
    inFirstParagraph,
    inUrl,
  };
}

/**
 * Perform full keyword analysis on content
 */
export function analyzeKeywords(
  content: {
    title?: string | null;
    description?: string | null;
    h1s?: string[];
    bodyText: string;
    url?: string;
  },
  options: {
    minWordLength?: number;
    topN?: number;
    focusKeyword?: string;
  } = {}
): KeywordAnalysisResult {
  const { minWordLength = 3, topN = 20, focusKeyword } = options;

  // Extract all words from body text
  const allWords = extractWords(content.bodyText, true);
  const contentWords = extractWords(content.bodyText, false);
  const totalWords = allWords.length;
  const uniqueWords = new Set(contentWords).size;

  // Count word frequency
  const frequency = countWordFrequency(contentWords);

  // Create keyword metrics for all keywords
  const keywords: KeywordMetrics[] = [];

  frequency.forEach((_, keyword) => {
    if (keyword.length >= minWordLength) {
      const metrics = analyzeKeyword(keyword, content, totalWords);
      keywords.push(metrics);
    }
  });

  // Sort by density
  keywords.sort((a, b) => b.density - a.density);

  // Get top keywords
  const topKeywords = keywords.slice(0, topN);

  // Analyze focus keyword if provided
  let focusKeywordMetrics: KeywordMetrics | undefined;
  if (focusKeyword) {
    focusKeywordMetrics = analyzeKeyword(focusKeyword, content, totalWords);
  }

  return {
    totalWords,
    uniqueWords,
    keywords,
    topKeywords,
    focusKeyword: focusKeywordMetrics,
  };
}

/**
 * Analyze keyword phrases (2-3 words)
 */
export function analyzeKeywordPhrases(
  text: string,
  phraseLength: 2 | 3 = 2
): Array<{ phrase: string; count: number; density: number }> {
  const words = extractWords(text, true);
  const totalWords = words.length;
  const phrases = new Map<string, number>();

  // Extract phrases
  for (let i = 0; i <= words.length - phraseLength; i++) {
    const phrase = words.slice(i, i + phraseLength).join(' ');
    phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
  }

  // Convert to array and sort by count
  const result = Array.from(phrases.entries())
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: calculateDensity(count, totalWords),
    }))
    .filter((item) => item.count > 1) // Only phrases that appear more than once
    .sort((a, b) => b.count - a.count);

  return result.slice(0, 20); // Top 20 phrases
}

/**
 * Calculate keyword stuffing risk
 */
export function detectKeywordStuffing(
  keywords: KeywordMetrics[]
): { isRisky: boolean; riskyKeywords: KeywordMetrics[] } {
  const STUFFING_THRESHOLD = 3.5; // Density above 3.5% is risky

  const riskyKeywords = keywords.filter((kw) => kw.density > STUFFING_THRESHOLD);

  return {
    isRisky: riskyKeywords.length > 0,
    riskyKeywords,
  };
}
