import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sitemapUrl } = await req.json();

    if (!sitemapUrl) {
      throw new Error('Sitemap URL is required');
    }

    // Fetch sitemap
    const response = await fetch(sitemapUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
    }

    const xmlContent = await response.text();

    // Parse XML using regex (DOMParser text/xml is not supported in Deno)
    const urls: SitemapUrl[] = [];
    const childSitemaps: string[] = [];

    // Extract URLs from <url> elements
    const urlMatches = xmlContent.matchAll(/<url>(.*?)<\/url>/gs);
    for (const match of urlMatches) {
      const urlBlock = match[1];
      
      const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/);
      const lastmodMatch = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/);
      const changefreqMatch = urlBlock.match(/<changefreq>(.*?)<\/changefreq>/);
      const priorityMatch = urlBlock.match(/<priority>(.*?)<\/priority>/);

      if (locMatch && locMatch[1]) {
        urls.push({
          loc: locMatch[1].trim(),
          ...(lastmodMatch && lastmodMatch[1] && { lastmod: lastmodMatch[1].trim() }),
          ...(changefreqMatch && changefreqMatch[1] && { changefreq: changefreqMatch[1].trim() }),
          ...(priorityMatch && priorityMatch[1] && { priority: priorityMatch[1].trim() }),
        });
      }
    }

    // Check for sitemap index (sitemaps containing other sitemaps)
    const sitemapMatches = xmlContent.matchAll(/<sitemap>(.*?)<\/sitemap>/gs);
    for (const match of sitemapMatches) {
      const sitemapBlock = match[1];
      const locMatch = sitemapBlock.match(/<loc>(.*?)<\/loc>/);
      
      if (locMatch && locMatch[1]) {
        childSitemaps.push(locMatch[1].trim());
      }
    }

    return new Response(
      JSON.stringify({
        sitemapUrl,
        urlCount: urls.length,
        urls,
        childSitemaps,
        isSitemapIndex: childSitemaps.length > 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
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
