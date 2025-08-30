/**
 * @todo
 * Add a reporter for node environment. I have a checker which lets me know if I am not in the browser.
 * Format the logger to look as nice as possible like a clack browser with console.log
 */

import { isNode, isDeno, isBun } from 'std-env'
import {
    createConsola,
    type LogType, type ConsolaOptions, type ConsolaInstance
} from 'consola/browser';


const isBrowser = !isNode && !isDeno && !isBun;

console.log(`isBrowser::${isBrowser}`);

export const logger = (
    tag = '@adenta/core',
    opts: Partial<ConsolaOptions & { fancy: boolean }> = { fancy: true }
) => {
    const inst = createConsola(opts).withTag(tag).addReporter({
        log: (logObj, ctx) => {
            if(!isBrowser) console.log(JSON.stringify(logObj))
        }
    })
    const logTypes = Object.keys(inst.options.types) as LogType[]

    return logTypes.reduce((acc, type) => {
        acc[type] = inst[type];
        return acc
    }, {}) as ConsolaInstance;
}


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

const log = logger("@adenta/cli")

// Usage examples:
log.info('Hello World');
log.success('Operation completed');
log.error('Something went wrong');
log.warn('Warning message');
log.debug('Debug information');
log.box("Box Message")

export default logger