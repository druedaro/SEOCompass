# Edge Functions Deployment Guide

This guide explains how to deploy and test the Supabase Edge Functions for SEO Compass.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Supabase project created
- API keys configured in Supabase dashboard

## Edge Functions Overview

### 1. scrape-serp
Scrapes SERP data using ScrapingBee API.

**Environment Variables:**
- `SCRAPINGBEE_API_KEY` - Your ScrapingBee API key

**Usage:**
```bash
supabase functions serve scrape-serp --env-file .env.local
```

**Example Request:**
```json
{
  "url": "https://example.com",
  "keyword": "seo tools"
}
```

### 2. pagespeed-audit
Runs Google PageSpeed Insights audits.

**Environment Variables:**
- `PAGESPEED_API_KEY` - Your Google PageSpeed Insights API key

**Usage:**
```bash
supabase functions serve pagespeed-audit --env-file .env.local
```

**Example Request:**
```json
{
  "url": "https://example.com",
  "strategy": "mobile"
}
```

### 3. sitemap-parser
Parses XML sitemaps and extracts URLs.

**No API keys required**

**Usage:**
```bash
supabase functions serve sitemap-parser --env-file .env.local
```

**Example Request:**
```json
{
  "sitemapUrl": "https://example.com/sitemap.xml"
}
```

## Environment Setup

Create a `.env.local` file in the project root:

```env
SCRAPINGBEE_API_KEY=your_scrapingbee_key_here
PAGESPEED_API_KEY=your_google_pagespeed_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Testing

### Test All Functions
```bash
# Start all functions locally
supabase functions serve --env-file .env.local

# Test individual function
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/scrape-serp' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://example.com","keyword":"seo"}'
```

### Test scrape-serp
```bash
supabase functions serve scrape-serp --env-file .env.local

curl -i --location --request POST \
  'http://localhost:54321/functions/v1/scrape-serp' \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://example.com","keyword":"seo tools"}'
```

### Test pagespeed-audit
```bash
supabase functions serve pagespeed-audit --env-file .env.local

curl -i --location --request POST \
  'http://localhost:54321/functions/v1/pagespeed-audit' \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://example.com","strategy":"mobile"}'
```

### Test sitemap-parser
```bash
supabase functions serve sitemap-parser --env-file .env.local

curl -i --location --request POST \
  'http://localhost:54321/functions/v1/sitemap-parser' \
  --header 'Content-Type: application/json' \
  --data '{"sitemapUrl":"https://example.com/sitemap.xml"}'
```

## Production Deployment

### 1. Set Environment Variables in Supabase

Go to your Supabase Dashboard → Settings → Edge Functions → Add secrets:

```bash
supabase secrets set SCRAPINGBEE_API_KEY=your_key
supabase secrets set PAGESPEED_API_KEY=your_key
```

### 2. Deploy Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy scrape-serp
supabase functions deploy pagespeed-audit
supabase functions deploy sitemap-parser
```

### 3. Verify Deployment

```bash
# List deployed functions
supabase functions list

# Check function logs
supabase functions logs scrape-serp
```

## Invoking from Client

```typescript
import { supabase } from '@/lib/supabaseClient';

// Scrape SERP
const { data, error } = await supabase.functions.invoke('scrape-serp', {
  body: { url: 'https://example.com', keyword: 'seo' }
});

// PageSpeed Audit
const { data, error } = await supabase.functions.invoke('pagespeed-audit', {
  body: { url: 'https://example.com', strategy: 'mobile' }
});

// Parse Sitemap
const { data, error } = await supabase.functions.invoke('sitemap-parser', {
  body: { sitemapUrl: 'https://example.com/sitemap.xml' }
});
```

## Troubleshooting

### Function fails to deploy
- Check that you're logged in: `supabase login`
- Verify project link: `supabase link --project-ref YOUR_PROJECT_REF`

### CORS errors
- Ensure `corsHeaders` are properly set in function code
- Check OPTIONS method handling for preflight requests

### API key not found
- Verify secrets are set: `supabase secrets list`
- Check environment variable names match code

### Rate limiting
- ScrapingBee has rate limits based on your plan
- Google PageSpeed Insights: 25,000 requests/day (free tier)

## Performance Considerations

- **Cold starts**: First invocation may take 1-2 seconds
- **Caching**: Consider implementing Redis/cache layer for frequent requests
- **Timeouts**: Edge functions have 150s timeout limit
- **Payload size**: Max 6MB request/response

## Security Best Practices

1. **Never expose API keys** in client code
2. **Use RLS policies** to restrict function invocation
3. **Validate input** in all functions
4. **Rate limit** client requests
5. **Monitor usage** to detect abuse

## Cost Optimization

- **ScrapingBee**: ~$0.001-0.01 per request (depends on plan)
- **PageSpeed**: Free tier (25K/day), then paid
- **Supabase Edge Functions**: 500K invocations/month free

## Next Steps

- Implement caching strategy
- Add request rate limiting
- Set up monitoring/alerts
- Create integration tests
- Document API responses
