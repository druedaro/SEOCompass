export interface ScrapingSeoConfig {
    apiKey: string;
    baseUrl: string;
}

export interface ScrapingSeoRequest {
    url: string;
    extractRules?: Record<string, unknown>;
    returnHtml?: boolean;
    renderJs?: boolean;
}

export interface ScrapingSeoResponse {
    url: string;
    title: string;
    meta_description?: string;
    h1?: string;
    status_code: number;
    redirect_url?: string;
}

export interface ScrapingSeoHtmlResponse {
    html: string;
    final_url: string;
    status_code: number;
    headers: Record<string, string>;
}
