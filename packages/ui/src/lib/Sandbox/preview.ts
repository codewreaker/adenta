export const createPreviewHtml = () => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Live Preview</title>
    
    <!-- Load React -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; }
      #root { padding: 1rem; }
      .error { 
        color: #c00; 
        padding: 1rem; 
        background: #fee;
        white-space: pre-wrap;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const root = ReactDOM.createRoot(document.getElementById('root'));
      
      window.addEventListener('message', (event) => {
        const { type, payload } = event.data;
        
        if (type === 'update-preview') {
          try {
            // Clear previous error state
            root.render(null);
            
            // Execute the new bundle
            eval(payload.bundle);
            
            // Notify parent of success
            window.parent.postMessage({ type: 'preview-updated' }, '*');
          } catch (error) {
            console.error('Preview error:', error);
            root.render(
              React.createElement('pre', { className: 'error' }, error.message)
            );
            window.parent.postMessage({ 
              type: 'preview-error', 
              payload: { error: error.message }
            }, '*');
          }
        }
      });
      
      // Signal ready
      window.parent.postMessage({ type: 'preview-ready' }, '*');
    </script>
  </body>
</html>
  `.trim();
};

// Create a blob URL for the preview HTML
export const PREVIEW_URL = typeof window !== 'undefined' 
  ? URL.createObjectURL(new Blob([createPreviewHtml()], { type: 'text/html' }))
  : '';
