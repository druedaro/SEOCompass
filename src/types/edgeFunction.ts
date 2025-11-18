export interface ScrapingBeeResponse {
  url: string;
  title: string;
  meta_description?: string;
  h1?: string;
  status_code: number;
  redirect_url?: string;
}
