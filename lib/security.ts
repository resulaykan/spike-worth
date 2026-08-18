// In-Memory Sliding Window Rate Limiter for Server Endpoints
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Rate limit: Maximum 5 actions per 10 minutes per IP
export function checkRateLimit(identifier: string, limit = 5, windowMs = 10 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

// Sanitize user inputs to prevent XSS / Injection
export function sanitizeText(input: string, maxLen = 200): string {
  if (!input) return '';
  return input
    .slice(0, maxLen)
    .replace(/[<>]/g, '') // strip html tags
    .trim();
}
