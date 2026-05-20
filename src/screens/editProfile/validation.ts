export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

// Máximos de caracteres por campo
export const FIELD_LIMITS = {
  name: 50,
  lastName: 50,
  title: 100,
  company: 100,
  bio: 500,
  linkedIn: 200,
  website: 200,
} as const;

// Sanitizar string: escapa caracteres HTML peligrosos
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validar que no haya scripts o tags HTML
export const containsDangerousContent = (input: string): boolean => {
  const dangerousPatterns = [
    /<script/i,
    /<\/script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /data:text\/html/i,
  ];
  return dangerousPatterns.some(pattern => pattern.test(input));
};

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // URL opcional
  return URL_REGEX.test(url.trim());
};

export const validateFieldLength = (field: string, value: string): boolean => {
  const limit = FIELD_LIMITS[field as keyof typeof FIELD_LIMITS];
  if (!limit) return true; // Campo sin límite definido
  return value.length <= limit;
};