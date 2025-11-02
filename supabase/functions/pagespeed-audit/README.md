# PageSpeed Audit Edge Function

This edge function runs Google PageSpeed Insights audits using the official API.

## Usage

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/pagespeed-audit' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://example.com",
    "strategy": "mobile"
  }'
```

## Parameters

- `url` (required): The URL to audit
- `strategy` (optional): "mobile" or "desktop" (default: "mobile")

## Environment Variables

- `PAGESPEED_API_KEY`: Your Google PageSpeed Insights API key

## Response

```json
{
  "url": "https://example.com",
  "strategy": "mobile",
  "scores": {
    "performance": 95,
    "accessibility": 100,
    "bestPractices": 92,
    "seo": 100
  },
  "audits": {
    "first-contentful-paint": {
      "score": 0.98,
      "displayValue": "1.2 s",
      "description": "...",
      "title": "First Contentful Paint"
    }
  }
}
```
