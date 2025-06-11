// mocks/setup.js
//import { setupServer } from 'msw/node';
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// For browser environment
export const worker = setupWorker(...handlers);

// For Node.js environment (testing)
//export const server = setupServer(...handlers);

// Setup function for browser
export const startMocking = async () => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  } else {
    console.log("Node Environment");
    // Node.js environment
    // server.listen({
    //   onUnhandledRequest: 'bypass',
    // });
  }
};
