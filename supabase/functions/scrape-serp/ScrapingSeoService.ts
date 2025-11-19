
import type {
  ScrapingSeoConfig,
  ScrapingSeoRequest,
  ScrapingSeoResponse,
  ScrapingSeoHtmlResponse
} from '../../../src/types/scraping.ts';

export class ScrapingSeoService {
  private config: ScrapingSeoConfig;

  constructor(config: ScrapingSeoConfig) {
    this.config = config;
  }

  private buildUrl(request: ScrapingSeoRequest): URL {
    const url = new URL(this.config.baseUrl);
    url.searchParams.set('api_key', this.config.apiKey);
    url.searchParams.set('url', request.url);

    if (request.renderJs !== false) {
      url.searchParams.set('render_js', 'true');
      url.searchParams.set('wait', '3000');
      url.searchParams.set('block_ads', 'true');
      url.searchParams.set('block_resources', 'false');
    }

    if (request.extractRules) {
      url.searchParams.set('extract_rules', JSON.stringify(request.extractRules));
    }

    return url;
  }

  async scrape(request: ScrapingSeoRequest): Promise<ScrapingSeoResponse | ScrapingSeoHtmlResponse> {
    const url = this.buildUrl(request);
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`ScrapingSeo API error: ${response.status} ${response.statusText}`);
    }

    if (request.returnHtml) {
      const html = await response.text();
      const finalUrl = response.headers.get('spb-final-url') || request.url;
      const statusCode = parseInt(response.headers.get('spb-status-code') || '200');

      return {
        html,
        final_url: finalUrl,
        status_code: statusCode,
        headers: Object.fromEntries(response.headers.entries()),
      };
    }

    const data = await response.json() as ScrapingSeoResponse;
    return data;
  }
}
