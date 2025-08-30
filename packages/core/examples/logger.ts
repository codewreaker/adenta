import { logger } from "../src/index.ts"
const log = logger("@adenta/cli")

// Usage examples:
log.info('Hello World');
log.success('Operation completed');
log.error('Something went wrong');
log.warn('Warning message');
log.debug('Debug information');
log.box("Box Message")
