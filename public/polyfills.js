// Polyfill for Promise.withResolvers for older browsers
if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Polyfill for transferToFixedLength method for ArrayBuffer
if (typeof ArrayBuffer !== 'undefined') {
  if (typeof ArrayBuffer.prototype.transferToFixedLength === 'undefined') {
    ArrayBuffer.prototype.transferToFixedLength = function() {
      const result = new ArrayBuffer(this.byteLength);
      const source = new Uint8Array(this);
      const dest = new Uint8Array(result);
      dest.set(source);
      return result;
    };
  }
}

// Additional polyfills for TypedArray methods
if (typeof Uint8Array !== 'undefined') {
  if (typeof Uint8Array.prototype.transferToFixedLength === 'undefined') {
    Uint8Array.prototype.transferToFixedLength = function() {
      return new Uint8Array(this);
    };
  }
}

if (typeof Uint16Array !== 'undefined') {
  if (typeof Uint16Array.prototype.transferToFixedLength === 'undefined') {
    Uint16Array.prototype.transferToFixedLength = function() {
      return new Uint16Array(this);
    };
  }
}

if (typeof Uint32Array !== 'undefined') {
  if (typeof Uint32Array.prototype.transferToFixedLength === 'undefined') {
    Uint32Array.prototype.transferToFixedLength = function() {
      return new Uint32Array(this);
    };
  }
}

// Polyfill for URLSearchParams for older environments
if (typeof URLSearchParams === 'undefined') {
  window.URLSearchParams = function(queryString) {
    this.params = {};
    if (queryString) {
      const pairs = queryString.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        if (pair.length === 2) {
          this.params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
      }
    }
  };
  URLSearchParams.prototype.get = function(name) {
    return this.params[name] || null;
  };
  URLSearchParams.prototype.set = function(name, value) {
    this.params[name] = value;
  };
  URLSearchParams.prototype.has = function(name) {
    return name in this.params;
  };
}

// Polyfill for url.parse for older environments
if (typeof require !== 'undefined' && require.main === module) {
  const url = require('url');
  if (typeof url.parse === 'undefined') {
    url.parse = function(urlString) {
      return new URL(urlString);
    };
  }
}

// Browser polyfill for URL parsing
if (typeof window !== 'undefined') {
  if (typeof window.url === 'undefined') {
    window.url = {
      parse: function(urlString) {
        try {
          const urlObj = new URL(urlString);
          return {
            href: urlObj.href,
            origin: urlObj.origin,
            protocol: urlObj.protocol,
            host: urlObj.host,
            hostname: urlObj.hostname,
            port: urlObj.port,
            pathname: urlObj.pathname,
            search: urlObj.search,
            searchParams: urlObj.searchParams,
            hash: urlObj.hash
          };
        } catch (e) {
          // Fallback for malformed URLs - simple parsing
          const protocolMatch = urlString.match(/^(\w+:)\/\//);
          const protocol = protocolMatch ? protocolMatch[1] : '';
          const withoutProtocol = protocolMatch ? urlString.substring(protocolMatch[0].length) : urlString;
          const pathAndQuery = withoutProtocol.split('/');
          const host = pathAndQuery.length > 0 ? pathAndQuery[0] : '';
          const pathname = '/' + pathAndQuery.slice(1).join('/');
          const queryMatch = pathname.match(/\?(.+)$/);
          const search = queryMatch ? queryMatch[0] : '';
          const pathnameWithoutQuery = queryMatch ? pathname.substring(0, queryMatch.index) : pathname;
          const hashMatch = urlString.match(/(#.+)$/);
          const hash = hashMatch ? hashMatch[0] : '';
          
          return {
            href: urlString,
            origin: protocol + '//' + host,
            protocol: protocol,
            host: host,
            hostname: host.split(':')[0],
            port: host.split(':')[1] || '',
            pathname: pathnameWithoutQuery,
            search: search,
            searchParams: new URLSearchParams(queryMatch ? queryMatch[1] : ''),
            hash: hash
          };
        }
      }
    };
  }
  
  // Polyfill for URL.parse as well
  if (typeof window.URL === 'undefined') {
    window.URL = {};
  }
  if (typeof window.URL.parse === 'undefined') {
    window.URL.parse = function(urlString) {
      // Simple parsing fallback for older browsers
      const protocolMatch = urlString.match(/^(\w+:)\/\//);
      const protocol = protocolMatch ? protocolMatch[1] : '';
      const withoutProtocol = protocolMatch ? urlString.substring(protocolMatch[0].length) : urlString;
      const pathAndQuery = withoutProtocol.split('/');
      const host = pathAndQuery.length > 0 ? pathAndQuery[0] : '';
      const pathname = '/' + pathAndQuery.slice(1).join('/');
      const queryMatch = pathname.match(/\?(.+)$/);
      const search = queryMatch ? queryMatch[0] : '';
      const pathnameWithoutQuery = queryMatch ? pathname.substring(0, queryMatch.index) : pathname;
      const hashMatch = urlString.match(/(#.+)$/);
      const hash = hashMatch ? hashMatch[0] : '';
      
      return {
        href: urlString,
        origin: protocol + '//' + host,
        protocol: protocol,
        host: host,
        hostname: host.split(':')[0],
        port: host.split(':')[1] || '',
        pathname: pathnameWithoutQuery,
        search: search,
        searchParams: new URLSearchParams(queryMatch ? queryMatch[1] : ''),
        hash: hash
      };
    };
  }
}
