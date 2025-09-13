import { isBrowser } from "../utils/env-utils.js";

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
