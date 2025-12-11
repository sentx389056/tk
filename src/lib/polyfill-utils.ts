// Utility functions for polyfill management

export const waitForPolyfills = async (timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve(); // Server-side, no polyfills needed
      return;
    }

    if (window.polyfillsLoaded) {
      resolve(); // Polyfills already loaded
      return;
    }

    const startTime = Date.now();
    const checkPolyfills = () => {
      if (window.polyfillsLoaded) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        console.warn('Polyfills did not load within timeout, proceeding anyway');
        resolve(); // Resolve anyway to not block functionality
      } else {
        setTimeout(checkPolyfills, 50);
      }
    };

    checkPolyfills();
  });
};

export const checkPolyfillSupport = (): boolean => {
  if (typeof window === 'undefined') return true;

  const checks = [
    typeof Promise.withResolvers !== 'undefined',
    typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.prototype.transferToFixedLength !== 'undefined',
    typeof URLSearchParams !== 'undefined',
    typeof window !== 'undefined' && typeof window.url !== 'undefined' && typeof window.url.parse !== 'undefined',
    typeof window !== 'undefined' && typeof window.URL !== 'undefined' && typeof window.URL.parse !== 'undefined',
  ];

  return checks.every(Boolean);
};

// Declare the global polyfillsLoaded flag and URL polyfills
declare global {
  interface Window {
    polyfillsLoaded?: boolean;
    url?: {
      parse?: (urlString: string) => {
        href: string;
        origin: string;
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        searchParams: URLSearchParams;
        hash: string;
      };
    };
    URL?: {
      parse?: (urlString: string) => {
        href: string;
        origin: string;
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        searchParams: URLSearchParams;
        hash: string;
      };
    };
  }
}
