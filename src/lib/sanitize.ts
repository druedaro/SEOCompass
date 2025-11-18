import DOMPurify from 'dompurify';

export function sanitize(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  let output = value;
  output = output.normalize('NFKC');
  output = output.replace(/[\u200B-\u200F\u202A-\u202E]/g, '');
  output = output.replace(/<script.*?>.*?<\/script>/gi, '');
  output = DOMPurify.sanitize(output);
  return typeof output === 'string' ? output : String(output);
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const cleaned: Record<string, unknown> = {};

  for (const key in obj) {
    cleaned[key] = sanitize(obj[key]);
  }

  return cleaned as T;
}
