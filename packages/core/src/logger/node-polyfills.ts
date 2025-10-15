/**
 * Browser-compatible implementation of Node.js util.formatWithOptions
 * using std-env instead of process. Generated with claude
 */

import { isCI, isDevelopment, isProduction } from 'std-env';
import { isBrowser } from "../utils/env-utils.js";

// TypeScript interfaces for inspection options
interface InspectOptions {
  showHidden?: boolean;
  depth?: number;
  colors?: boolean;
  customInspect?: boolean;
  showProxy?: boolean;
  maxArrayLength?: number;
  maxStringLength?: number;
  breakLength?: number;
  compact?: boolean | number;
  sorted?: boolean;
  getters?: boolean;
}

// Default inspection options
const defaultInspectOptions: Required<InspectOptions> = {
  showHidden: false,
  depth: 2,
  colors: !isCI && isDevelopment, // Auto-detect colors based on environment
  customInspect: true,
  showProxy: false,
  maxArrayLength: 100,
  maxStringLength: 10000,
  breakLength: 80,
  compact: 3,
  sorted: false,
  getters: false
};

/**
 * Simple object inspection similar to Node.js util.inspect
 */
function inspect(obj: unknown, options: InspectOptions = {}): string {
  const opts: Required<InspectOptions> = { ...defaultInspectOptions, ...options };
  
  function inspectValue(value: unknown, currentDepth = 0): string {
    if (currentDepth > opts.depth) {
      return '[Object]';
    }
    
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    const type = typeof value;
    
    if (type === 'string') {
      //Truncate long strings in production |
      const truncatedValue = isProduction && (value as string).length > opts.maxStringLength 
        ? (value as string).substring(0, opts.maxStringLength) + '...' 
        : value;
        
      if (opts.colors) {
        return `\x1b[32m'${truncatedValue}'\x1b[0m`; // Green
      }
      return `'${truncatedValue}'`;
    }
    
    if (type === 'number') {
      if (opts.colors) {
        return `\x1b[33m${value}\x1b[0m`; // Yellow
      }
      return String(value);
    }
    
    if (type === 'boolean') {
      if (opts.colors) {
        return `\x1b[33m${value}\x1b[0m`; // Yellow
      }
      return String(value);
    }
    
    if (type === 'function') {
      const funcStr = value.toString();
      const match = funcStr.match(/^(?:async\s+)?(?:function\s*)?([^(\s]*)/);
      const name = match && match[1] ? match[1] : 'anonymous';
      
      if (opts.colors) {
        return `\x1b[36m[Function: ${name}]\x1b[0m`; // Cyan
      }
      return `[Function: ${name}]`;
    }
    
    if (value instanceof Date) {
      if (opts.colors) {
        return `\x1b[35m${value.toISOString()}\x1b[0m`; // Magenta
      }
      return value.toISOString();
    }
    
    if (value instanceof RegExp) {
      if (opts.colors) {
        return `\x1b[31m${value}\x1b[0m`; // Red
      }
      return String(value);
    }
    
    if (Array.isArray(value)) {
      if (currentDepth >= opts.depth) {
        return '[Array]';
      }
      
      const items: string[] = value.slice(0, opts.maxArrayLength).map((item: unknown) => 
        inspectValue(item, currentDepth + 1)
      );
      
      if (value.length > opts.maxArrayLength) {
        items.push(`... ${value.length - opts.maxArrayLength} more items`);
      }
      
      return `[ ${items.join(', ')} ]`;
    }
    
    if (type === 'object') {
      if (currentDepth >= opts.depth) {
        return '[Object]';
      }
      
      // Handle custom inspect method
      if (opts.customInspect && 
          value !== null && 
          typeof value === 'object' && 
          Symbol.for('nodejs.util.inspect.custom') in value) {
        const customInspectFn = (value as any)[Symbol.for('nodejs.util.inspect.custom')];
        if (typeof customInspectFn === 'function') {
          return customInspectFn(opts.depth, opts);
        }
      }
      
      const keys: string[] = opts.showHidden ? 
        Object.getOwnPropertyNames(value as object) : 
        Object.keys(value as object);
      
      if (opts.sorted) {
        keys.sort();
      }
      
      const pairs: string[] = keys.map((key: string) => {
        const val = inspectValue((value as any)[key], currentDepth + 1);
        const keyStr = opts.colors ? `\x1b[32m${key}\x1b[0m` : key;
        return `${keyStr}: ${val}`;
      });
      
      if (pairs.length === 0) {
        return '{}';
      }
      
      const shouldBreak = pairs.join(', ').length > opts.breakLength;
      if (shouldBreak) {
        const indent = '  '.repeat(currentDepth + 1);
        const closeIndent = '  '.repeat(currentDepth);
        return `{\n${indent}${pairs.join(`,\n${indent}`)}\n${closeIndent}}`;
      }
      
      return `{ ${pairs.join(', ')} }`;
    }
    
    return String(value);
  }
  
  return inspectValue(obj);
}

/**
 * Browser-compatible formatWithOptions implementation
 */
export function formatWithOptions(inspectOptions: InspectOptions, f: unknown, ...args: unknown[]): string {
  let i = 0;
  
  if (typeof f !== 'string') {
    const objects = [f, ...args].map(arg => inspect(arg, inspectOptions));
    return objects.join(' ');
  }
  
  const str = String(f).replace(/%[sdifjoO%]/g, (x: string): string => {
    if (x === '%%') return '%';
    if (i >= args.length) return x;
    
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return String(Number(args[i++]));
      case '%i': return String(parseInt(String(args[i++]), 10));
      case '%f': return String(parseFloat(String(args[i++])));
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch {
          return '[Circular]';
        }
      case '%o':
      case '%O':
        return inspect(args[i++], inspectOptions);
      default:
        return x;
    }
  });
  
  // Append remaining arguments
  const remaining = args.slice(i);
  if (remaining.length > 0) {
    const remainingStr = remaining.map(arg => inspect(arg, inspectOptions)).join(' ');
    return str + ' ' + remainingStr;
  }
  
  return str;
}


// Example usage:
/*
console.log(formatWithOptions({ colors: true }, 'Hello %s, you are %d years old', 'Alice', 30));
console.log(formatWithOptions({ depth: 3 }, 'Object: %O', { a: 1, b: { c: 2, d: { e: 3 } } }));
console.log(format('Simple format: %s %d', 'test', 42));
*/


/**
 * Copied from https://github.com/unjs/consola/blob/512d570b3f99a27b6766a885cae2730aa3dc0ed4/src/utils/stream.ts
 * Writes data to a specified NodeJS writable stream. This function supports streams that have a custom
 * `__write' method, and will fall back to the default `write' method if `__write' is not present.
 *
 * @param {any} data - The data to write to the stream. This can be a string, a buffer, or any data type
 * supported by the stream's `write' or `__write' method.
 * @param {NodeJS.WriteStream} stream - The writable stream to write the data to. This stream
 * must implement the `write' method, and can optionally implement a custom `__write' method.
 * @returns {boolean} `true` if the data has been completely processed by the write operation,
 * indicating that further writes can be performed immediately. Returns `false` if the data is
 * buffered by the stream, indicating that the `drain` event should be waited for before writing
 * more data.
 */
export function writeStream(data: any, stream: NodeJS.WriteStream) {
  const write = (stream as any).__write || stream.write;
  return write.call(stream, data);
}

// Smart fallback streams
const getDefaultStreams = () => {
  const fallback = {
    stdout: {
      write: (data: string) => {
        console.log(data.replace(/\n$/, ''));
        return true;
      },
    } as NodeJS.WriteStream,
    stderr: {
      write: (data: string) => {
        console.error(data.replace(/\n$/, ''));
        return true;
      },
    } as NodeJS.WriteStream,
  };

  if (isBrowser) {
    // In browser, return console-based fallbacks
    return fallback;
  }

  // In Node.js/Deno/Bun environments, use process streams
  try {
    return {
      stdout: process.stdout,
      stderr: process.stderr,
    };
  } catch {
    // Fallback if process is somehow unavailable
    return fallback;
  }
};

export const fallbackStreams = getDefaultStreams();
