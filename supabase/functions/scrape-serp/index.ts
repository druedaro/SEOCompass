import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapingBeeResponse {
  url: string;
  title: string;
  meta_description?: string;
  h1?: string;
  status_code: number;
  redirect_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, extract_rules, return_html = false } = await req.json();

    if (!url) {
      throw new Error('URL is required');
    }

    // Get ScrapingBee API key from environment
    const scrapingBeeApiKey = Deno.env.get('SCRAPINGBEE_API_KEY');
    if (!scrapingBeeApiKey) {
      throw new Error('ScrapingBee API key not configured');
    }

    // Build ScrapingBee API URL
    const scrapingBeeUrl = new URL('https://app.scrapingbee.com/api/v1/');
    scrapingBeeUrl.searchParams.set('api_key', scrapingBeeApiKey);
    scrapingBeeUrl.searchParams.set('url', url);
    scrapingBeeUrl.searchParams.set('render_js', 'false');
    
    if (extract_rules) {
      scrapingBeeUrl.searchParams.set('extract_rules', JSON.stringify(extract_rules));
    }

    // Make request to ScrapingBee
    const response = await fetch(scrapingBeeUrl.toString());

    if (!response.ok) {
      throw new Error(`ScrapingBee API error: ${response.status} ${response.statusText}`);
    }

    // If return_html is true, return raw HTML
    if (return_html) {
      const html = await response.text();
      const finalUrl = response.headers.get('spb-final-url') || url;
      const statusCode = parseInt(response.headers.get('spb-status-code') || '200');
      
      return new Response(JSON.stringify({
        html,
        final_url: finalUrl,
        status_code: statusCode,
        headers: Object.fromEntries(response.headers.entries()),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const data = await response.json() as ScrapingBeeResponse;

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
