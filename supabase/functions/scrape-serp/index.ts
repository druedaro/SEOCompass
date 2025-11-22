import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { ScrapingSeoService } from './ScrapingSeoService.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, render_js = true } = await req.json();

    if (!url || typeof url !== 'string') {
      throw new Error('Valid URL is required');
    }

    const scrapingApiKey = Deno.env.get('SCRAPING_API_KEY');
    if (!scrapingApiKey) {
      throw new Error('Scraping API key not configured');
    }

    const scrapingApiBaseUrl = Deno.env.get('SCRAPING_API_BASE_URL');
    if (!scrapingApiBaseUrl) {
      throw new Error('Scraping API base URL not configured');
    }

    const scrapingService = new ScrapingSeoService({
      apiKey: scrapingApiKey,
      baseUrl: scrapingApiBaseUrl,
    });

    const data = await scrapingService.scrape({
      url,
      renderJs: render_js,
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
