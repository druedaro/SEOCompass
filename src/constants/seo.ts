export const SEO_LIMITS = {
  title: { min: 30, max: 60 },
  description: { min: 120, max: 160 },
  h1: { max: 1 },
  imageAlt: { required: true },
  internalLinks: { min: 3 },
  externalLinks: { max: 10 },
} as const;

export const CATEGORY_STYLES: Record<
  'meta' | 'content' | 'technical' | 'links' | 'images',
  string
> = {
  meta: 'bg-[#82ca9d] text-white border-[#82ca9d]',
  content: 'bg-[#ffc658] text-gray-900 border-[#ffc658]',
  technical: 'bg-[#ff7c7c] text-white border-[#ff7c7c]',
  links: 'bg-[#a28dd8] text-white border-[#a28dd8]',
  images: 'bg-pink-100 text-pink-800',
};

export const HTTP_STATUS_DESCRIPTIONS: Record<number, string> = {
  200: 'OK - The request was successful',
  201: 'Created - Resource successfully created',
  204: 'No Content - Request successful but no content to return',
  301: 'Moved Permanently - Resource permanently moved to new URL',
  302: 'Found - Resource temporarily moved to different URL',
  304: 'Not Modified - Resource not modified since last request',
  307: 'Temporary Redirect - Request should be repeated with another URL',
  308: 'Permanent Redirect - All future requests to new URL',
  400: 'Bad Request - Server cannot process the request',
  401: 'Unauthorized - Authentication required',
  403: 'Forbidden - Server refuses to authorize the request',
  404: 'Not Found - Resource not found on server',
  405: 'Method Not Allowed - Request method not supported',
  408: 'Request Timeout - Server timed out waiting for request',
  410: 'Gone - Resource permanently removed',
  429: 'Too Many Requests - Rate limit exceeded',
  500: 'Internal Server Error - Server encountered an error',
  502: 'Bad Gateway - Invalid response from upstream server',
  503: 'Service Unavailable - Server temporarily unavailable',
  504: 'Gateway Timeout - Upstream server timed out',
};
