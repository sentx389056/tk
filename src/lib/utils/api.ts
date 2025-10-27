export function getBaseUrl() {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
  }
  // Client-side
  return window.location.origin;
}