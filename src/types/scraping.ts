export interface ScrapingSeoConfig {
    apiKey: string;
    baseUrl: string;
}

export interface ScrapingSeoRequest {
    url: string;

    renderJs?: boolean;
}

export interface ScrapingSeoHtmlResponse {
    html: string;
    final_url: string;
    status_code: number;
    headers: Record<string, string>;
}
