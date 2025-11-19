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

    const scrapingSeoApiKey = Deno.env.get('SCRAPINGBEE_API_KEY');
    if (!scrapingSeoApiKey) {
      throw new Error('ScrapingSeo API key not configured');
    }

    const scrapingSeoBaseUrl = Deno.env.get('SCRAPINGBEE_BASE_URL') || 'https://app.scrapingbee.com/api/v1/';

    const scrapingService = new ScrapingSeoService({
      apiKey: scrapingSeoApiKey,
      baseUrl: scrapingSeoBaseUrl,
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
