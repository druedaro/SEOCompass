import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageSpeedInsightsResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: Record<string, {
      score: number | null;
      displayValue?: string;
      description: string;
      title: string;
    }>;
  };
  loadingExperience?: {
    metrics: Record<string, unknown>;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, strategy = 'mobile' } = await req.json();

    if (!url) {
      throw new Error('URL is required');
    }

    // Get PageSpeed Insights API key from environment
    const pageSpeedApiKey = Deno.env.get('PAGESPEED_API_KEY');
    if (!pageSpeedApiKey) {
      throw new Error('PageSpeed Insights API key not configured');
    }

    // Build PageSpeed Insights API URL
    const pageSpeedUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    pageSpeedUrl.searchParams.set('url', url);
    pageSpeedUrl.searchParams.set('key', pageSpeedApiKey);
    pageSpeedUrl.searchParams.set('strategy', strategy); // mobile or desktop
    pageSpeedUrl.searchParams.set('category', 'performance');
    pageSpeedUrl.searchParams.set('category', 'accessibility');
    pageSpeedUrl.searchParams.set('category', 'best-practices');
    pageSpeedUrl.searchParams.set('category', 'seo');

    // Make request to PageSpeed Insights
    const response = await fetch(pageSpeedUrl.toString());

    if (!response.ok) {
      throw new Error(`PageSpeed Insights API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as PageSpeedInsightsResponse;

    // Extract relevant data
    const result = {
      url,
      strategy,
      scores: {
        performance: data.lighthouseResult.categories.performance.score * 100,
        accessibility: data.lighthouseResult.categories.accessibility.score * 100,
        bestPractices: data.lighthouseResult.categories['best-practices'].score * 100,
        seo: data.lighthouseResult.categories.seo.score * 100,
      },
      audits: data.lighthouseResult.audits,
      loadingExperience: data.loadingExperience,
    };

    return new Response(JSON.stringify(result), {
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
