/**
 * Copied from https://github.com/unjs/consola/blob/512d570b3f99a27b6766a885cae2730aa3dc0ed4/src/reporters/basic.ts
 * refactored so I can implement a fancy reporter
 */

import type {
  LogObject,
  ConsolaReporter,
  FormatOptions,
  ConsolaOptions,
} from 'consola/browser';
import {
  writeStream, 
  fallbackStreams,
  formatWithOptions,
} from '../../../utils/index.js';



export class BaseReporter implements ConsolaReporter {
  formatStack(stack: string, message: string, opts: FormatOptions) {
    throw new Error('Method not implemented.');
  }

  formatError(err: any, opts: FormatOptions): string {
    const message = err.message ?? formatWithOptions(opts, err);
    const stack = err.stack ? this.formatStack(err.stack, message, opts) : '';

    const level = opts?.errorLevel || 0;
    const causedPrefix = level > 0 ? `${'  '.repeat(level)}[cause]: ` : '';
    const causedError = err.cause
      ? '\n\n' + this.formatError(err.cause, { ...opts, errorLevel: level + 1 })
      : '';

    return causedPrefix + message + '\n' + stack + causedError;
  }

  formatArgs(args: any[], opts: FormatOptions) {
    const _args = args.map((arg) => {
      if (arg && typeof arg.stack === 'string') {
        return this.formatError(arg, opts);
      }
      return arg;
    });

    // Only supported with Node >= 10
    //@ts-expect-error https://nodejs.org/api/util.html#util_util_inspect_object_options
    return formatWithOptions(opts, ..._args);
  }

  formatDate(date: Date, opts: FormatOptions) {
    return opts.date ? date.toLocaleTimeString() : '';
  }

  filterAndJoin(arr: any[]) {
    return arr.filter(Boolean).join(' ');
  }

  formatLogObj(logObj: LogObject, opts: FormatOptions) {
    throw new Error('Method not implemented.');
  }

  log(logObj: LogObject, ctx: { options: ConsolaOptions }) {
    const line = this.formatLogObj(logObj, {
      columns: (ctx.options.stdout as any)?.columns || 0,
      ...ctx.options.formatOptions,
    });

    return writeStream(
      line + '\n',
      logObj.level < 2
        ? ctx.options.stderr || fallbackStreams.stderr
        : ctx.options.stdout || fallbackStreams.stdout,
    );
  }
}
