# Scrape SERP Edge Function

This edge function scrapes web pages using ScrapingBee API to extract SEO-related data.

## Usage

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/scrape-serp' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://example.com",
    "extract_rules": {
      "title": "title",
      "meta_description": "meta[name=\"description\"]@content",
      "h1": "h1"
    }
  }'
```

## Environment Variables

- `SCRAPINGBEE_API_KEY`: Your ScrapingBee API key

## Response

```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "meta_description": "Example domain description",
  "h1": "Example Heading",
  "status_code": 200
}
```
