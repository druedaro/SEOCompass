import DOMPurify from 'dompurify';

/**
 * Limpia un string eliminando scripts, caracteres invisibles,
 * unicode raro y HTML peligroso.
 */
export function sanitize(value: unknown): unknown {
  // Si no es string, lo devolvemos tal cual (útil para números, booleanos, etc.)
  if (typeof value !== 'string') return value;

  let output = value;

  // 1) Normalizar Unicode para evitar caracteres equivalentes engañosos
  output = output.normalize('NFKC');

  // 2) Eliminar caracteres invisibles comunes usados en ataques o manipulación
  output = output.replace(/[\u200B-\u200F\u202A-\u202E]/g, '');

  // 3) Eliminar cualquier script explícito antes de sanear HTML
  output = output.replace(/<script.*?>.*?<\/script>/gi, '');

  // 4) Sanitizar HTML para quitar tags peligrosas (XSS)
  output = DOMPurify.sanitize(output);

  return output;
}

/**
 * Sanitiza un objeto entero (ej: los valores de un formulario).
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = {};

  for (const key in obj) {
    cleaned[key] = sanitize(obj[key]);
  }

  return cleaned as T;
}
