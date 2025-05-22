// This file contains the sandbox content directly in code for better portability
const sandboxHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Live Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <style>
      body { margin: 0; font-family: sans-serif; }
      #root { padding: 1rem; }
      .error { color: red; padding: 1rem; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      // Initialize ReactDOM
      const root = ReactDOM.createRoot(document.getElementById('root'));
      let currentRoot = null;
      
      window.addEventListener('message', (event) => {
        const { type, payload } = event.data;
        
        if (type === 'compile') {
          try {
            const code = payload.code;
            console.log('Executing code:', code);

            // Create module environment
            const moduleExports = {};
            
            // Transform the code to work in browser
            let transformedCode = code;
            transformedCode = transformedCode.replace(/import React from 'react';/, ''); // Remove import
            transformedCode = transformedCode.replace(/export const/g, 'moduleExports.'); // Replace export
            
            // Execute the transpiled code
            eval(transformedCode);
            
            // Render the component
            if (moduleExports.App) {
              console.log('Found App component, rendering...');
              root.render(React.createElement(moduleExports.App));
            } else {
              throw new Error('No App component found in the code');
            }
          } catch (error) {
            console.error('Sandbox error:', error);
            root.innerHTML = \`<div class="error">Error: \${error.message}</div>\`;
            window.parent.postMessage({ 
              type: 'error', 
              payload: { error: error.message } 
            }, '*');
          }
        }
      });

      // Signal that the sandbox is ready
      window.parent.postMessage({ type: 'ready' }, '*');
    </script>
  </body>
</html>`;

// Create a Blob URL from the HTML content
export const SANDBOX_DATA_URL = typeof window !== 'undefined' 
  ? URL.createObjectURL(new Blob([sandboxHtml], { type: 'text/html' }))
  : '';

// Clean up the Blob URL when the module is unloaded
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    if (SANDBOX_DATA_URL) {
      URL.revokeObjectURL(SANDBOX_DATA_URL);
    }
  });
}
