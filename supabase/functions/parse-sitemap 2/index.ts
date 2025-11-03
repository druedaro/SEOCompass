import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts';

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

    // Parse XML
    const doc = new DOMParser().parseFromString(xmlContent, 'text/xml');

    if (!doc) {
      throw new Error('Failed to parse sitemap XML');
    }

    // Extract URLs from sitemap
    const urlElements = doc.querySelectorAll('url');
    const urls: SitemapUrl[] = [];

    urlElements.forEach((urlElement) => {
      const loc = urlElement.querySelector('loc')?.textContent?.trim();
      const lastmod = urlElement.querySelector('lastmod')?.textContent?.trim();
      const changefreq = urlElement.querySelector('changefreq')?.textContent?.trim();
      const priority = urlElement.querySelector('priority')?.textContent?.trim();

      if (loc) {
        urls.push({
          loc,
          ...(lastmod && { lastmod }),
          ...(changefreq && { changefreq }),
          ...(priority && { priority }),
        });
      }
    });

    // Check for sitemap index (sitemaps containing other sitemaps)
    const sitemapElements = doc.querySelectorAll('sitemap');
    const childSitemaps: string[] = [];

    sitemapElements.forEach((sitemapElement) => {
      const loc = sitemapElement.querySelector('loc')?.textContent?.trim();
      if (loc) {
        childSitemaps.push(loc);
      }
    });

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
