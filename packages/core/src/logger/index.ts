/**
 * I've standardised this library to use only one version of `consola/browser`
 * to power both the browser and node. Had to do this because there is currently no way
 * of conditionally loading node or browser as webpack evaluates at runtime and require throws error.
 * I didn't want to polyfill and create a true ESM experience
 */
import { createConsola } from 'consola/browser';
import type {
  LogType,
  ConsolaOptions,
  ConsolaInstance
} from 'consola/browser';
import { FancyReporter } from './reporters/fancy.js';
import { isBrowser } from '../utils/env-utils.js';

export type LogInstance = Record<LogType, ConsolaInstance[LogType]>;


export const logger = (
  tag = '@adenta/core',
  opts: Partial<ConsolaOptions> = {},
) => {
  const inst = isBrowser
    ? createConsola({ ...opts }).withTag(tag)
    : createConsola({
        ...opts,
        reporters: [...(opts.reporters || []), new FancyReporter()],
      }).withTag(tag);

  const logTypes = Object.keys(inst.options.types) as LogType[];

  return logTypes.reduce((acc, type) => {
    acc[type] = inst[type];
    return acc;
  }, {} as LogInstance);
};

/**
 * @example
 * 
const log = logger("@adenta/cli")

// Usage examples:
log.info('Hello World');
log.success('Operation completed');
log.error('Something went wrong');
log.warn('Warning message');
log.debug('Debug information');
log.box("Box Message")
 */

export default logger;
