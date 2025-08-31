import { getCwd } from './cwd.ts';
import { sep } from 'pathe';


/**
 * Parses a stack trace string and normalises its paths by removing the current working directory and the "file://" protocol.
 * @param {string} stack - The stack trace string.
 * @returns {string[]} An array of stack trace lines with normalised paths.
 */
export function parseStack(stack: string, message: string) {
  const cwd = getCwd() + sep;

  const lines = stack
    .split('\n')
    .splice(message.split('\n').length)
    .map((l) => l.trim().replace('file://', '').replace(cwd, ''));

  console.log('CWD:', lines);
  return lines;
}
