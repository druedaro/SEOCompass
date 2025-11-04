# Supabase Edge Functions

## ScrapingBee Proxy

Este Edge Function actúa como proxy para ScrapingBee API, protegiendo la API key en el servidor.

### Configuración

1. **Instalar Supabase CLI** (si no lo tienes):
```bash
npm install -g supabase
```

2. **Vincular tu proyecto de Supabase**:
```bash
supabase link --project-ref usewvkylcfoivkthsetr
```

3. **Configurar la API key de ScrapingBee**:

Ve a tu dashboard de Supabase → Settings → Edge Functions → Secrets

Agrega el siguiente secret:
- Key: `SCRAPINGBEE_API_KEY`
- Value: Tu API key de ScrapingBee

O usa el CLI:
```bash
supabase secrets set SCRAPINGBEE_API_KEY=your_scrapingbee_api_key_here
```

4. **Desplegar el Edge Function**:
```bash
supabase functions deploy scrapingbee-proxy
```

### Obtener API Key de ScrapingBee

1. Ve a [ScrapingBee](https://www.scrapingbee.com/)
2. Crea una cuenta (tienen plan gratuito con 1,000 requests/mes)
3. Copia tu API key del dashboard
4. Agrégala como secret en Supabase

### Verificar que funciona

Después de desplegar, prueba el endpoint:

```bash
curl -X POST 'https://usewvkylcfoivkthsetr.supabase.co/functions/v1/scrapingbee-proxy' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'
```

### Alternativa: Sin ScrapingBee

Si no quieres usar ScrapingBee, puedes crear un Edge Function más simple que use `fetch` directamente (pero con limitaciones de CORS y bloqueos).
