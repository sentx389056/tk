/**
 * Browser compatibility utilities
 */

export function checkPromiseWithResolversSupport(): boolean {
  return typeof Promise.withResolvers !== 'undefined';
}

export function getPdfWorkerSrc(): string {
  // Use legacy worker for browsers that don't support Promise.withResolvers
  if (!checkPromiseWithResolversSupport()) {
    return '/pdf.worker.legacy.min.js';
  }
  return '/pdf.worker.min.js';
}

export function isOldBrowser(): boolean {
  // Check for various indicators of older browsers
  const userAgent = navigator.userAgent;
  
  // Check for Internet Explorer
  const isIE = /MSIE|Trident/.test(userAgent);
  
  // Check for very old Chrome versions
  const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
  const isOldChrome = chromeMatch && parseInt(chromeMatch[1]) < 100;
  
  // Check for very old Firefox versions
  const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
  const isOldFirefox = firefoxMatch && parseInt(firefoxMatch[1]) < 95;
  
  // Check for very old Safari versions
  const safariMatch = userAgent.match(/Version\/(\d+).*Safari/);
  const isOldSafari = safariMatch && parseInt(safariMatch[1]) < 14;
  
  return isIE || isOldChrome || isOldFirefox || isOldSafari || !checkPromiseWithResolversSupport();
}
