// This file contains the sandbox content directly in code for better portability
interface SandboxOptions {
  reactUrl?: string;
  reactDomUrl?: string;
  dependencies?: Array<{
    url: string;
    attrs?: string;
  }>;
}

const createSandboxHtml = (options: SandboxOptions = {}) => {
  const {
    reactUrl = 'https://unpkg.com/react@18/umd/react.development.js',
    reactDomUrl = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    dependencies = [{
        url: '/node_modules/@heroicons/react/index.esm.js',
    }],
  } = options;

  const dependencyScripts = dependencies
    .map(dep => `<script src="${dep.url}" ${dep.attrs || ''}></script>`)
    .join('\n    ');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Live Preview</title>
    <!-- Load React -->
    <script crossorigin src="${reactUrl}"></script>
    <script crossorigin src="${reactDomUrl}"></script>
    
    <!-- Load additional dependencies -->
    ${dependencyScripts}
    
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
      
      // Store rendered component for cleanup
      let currentComponent = null;
      
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
            transformedCode = transformedCode.replace(/import React from ['"]react['"];/, ''); // Remove React import
            transformedCode = transformedCode.replace(/export const/g, 'moduleExports.'); // Handle exports
            
            // Wrap in try-catch for better error handling
            const wrappedCode = \`
              try {
                \${transformedCode}
                
                // Store exports on window for access
                window.__lastExports__ = moduleExports;
              } catch (err) {
                console.error('Code execution error:', err);
                throw err;
              }
            \`;
            
            // Execute the transpiled code
            eval(wrappedCode);
            
            // Get the component (either App or default export)
            const Component = window.__lastExports__.App;
            
            if (Component) {
              console.log('Found component, rendering...');
              currentComponent = React.createElement(Component);
              root.render(currentComponent);
            } else {
              throw new Error('No App component found in the code');
            }

            // Cleanup
            delete window.__lastExports__;
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
};

// Create a Blob URL from the HTML content with default options
export const SANDBOX_DATA_URL = typeof window !== 'undefined' 
  ? URL.createObjectURL(new Blob([createSandboxHtml()], { type: 'text/html' }))
  : '';

// Export the createSandboxHtml function for custom configurations
export const createCustomSandbox = (options: SandboxOptions) => {
  if (typeof window === 'undefined') return '';
  return URL.createObjectURL(
    new Blob([createSandboxHtml(options)], { type: 'text/html' })
  );
};

// Clean up the Blob URL when the module is unloaded
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    if (SANDBOX_DATA_URL) {
      URL.revokeObjectURL(SANDBOX_DATA_URL);
    }
  });
}
