/**
 * Keyword Analysis Utilities - Simplified
 * Analyze keyword density and prominence in content
 */

export interface KeywordMetrics {
  keyword: string;
  count: number;
  density: number;
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inUrl: boolean;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'of', 'on', 'that', 'the', 'to',
  'was', 'will', 'with', 'you', 'this', 'but', 'they', 'have', 'what',
  'el', 'la', 'de', 'que', 'y', 'en', 'un', 'no', 'por', 'con', 'para',
]);

/**
 * Normalize and extract words
 */
function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Analyze keywords in content
 */
export function analyzeKeywords(content: {
  title: string | null;
  description: string | null;
  h1s: string[];
  bodyText: string;
  url: string;
}): KeywordMetrics[] {
  const words = extractWords(content.bodyText);
  const totalWords = words.length;

  // Count frequency
  const frequency = new Map<string, number>();
  words.forEach((word) => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  // Get top keywords (appearing at least 3 times)
  const topKeywords = Array.from(frequency.entries())
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => {
      const titleNorm = extractWords(content.title || '').join(' ');
      const descNorm = extractWords(content.description || '').join(' ');
      const h1Norm = extractWords(content.h1s.join(' ')).join(' ');
      const urlNorm = extractWords(content.url).join(' ');

      return {
        keyword,
        count,
        density: (count / totalWords) * 100,
        inTitle: titleNorm.includes(keyword),
        inDescription: descNorm.includes(keyword),
        inH1: h1Norm.includes(keyword),
        inUrl: urlNorm.includes(keyword),
      };
    });

  return topKeywords;
}

/**
 * Calculate keyword optimization score
 */
export function calculateKeywordScore(keyword: KeywordMetrics): number {
  let score = 0;
  if (keyword.inTitle) score += 30;
  if (keyword.inDescription) score += 20;
  if (keyword.inH1) score += 20;
  if (keyword.inUrl) score += 15;
  
  // Density (optimal 1-2.5%)
  if (keyword.density >= 1 && keyword.density <= 2.5) {
    score += 15;
  } else if (keyword.density < 1) {
    score += Math.round(keyword.density * 15);
  }

  return Math.min(100, score);
}
