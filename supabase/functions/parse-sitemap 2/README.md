# Parse Sitemap Edge Function

This edge function parses XML sitemaps and extracts all URLs with their metadata.

## Usage

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/parse-sitemap' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "sitemapUrl": "https://example.com/sitemap.xml"
  }'
```

## Parameters

- `sitemapUrl` (required): The URL of the sitemap to parse

## Response

```json
{
  "sitemapUrl": "https://example.com/sitemap.xml",
  "urlCount": 150,
  "urls": [
    {
      "loc": "https://example.com/page1",
      "lastmod": "2025-01-01",
      "changefreq": "weekly",
      "priority": "0.8"
    }
  ],
  "childSitemaps": [],
  "isSitemapIndex": false
}
```

## Features

- Parses standard XML sitemaps
- Detects sitemap index files (sitemaps containing other sitemaps)
- Extracts URL metadata (lastmod, changefreq, priority)
- Returns all URLs in a structured format
