import { logger } from "../src/index.ts"
const log = logger("@adenta/cli");

const error = new Error("This is an error\nWith second line\nAnd another", {
    cause: new Error("This is the cause", {
      cause: new Error("This is the cause of the cause"),
    }),
  });

// Usage examples:
log.info('Hello World');
log.success('Operation completed');
log.error(error);
log.warn('Warning message');
log.debug('Debug information');
log.box("Box Message")
