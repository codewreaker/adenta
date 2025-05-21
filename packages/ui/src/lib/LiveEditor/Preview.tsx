import React, { useEffect, useRef, useState } from 'react';
import { PreviewProps, SandboxMessage } from './types';

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<SandboxMessage>) => {
      const { type, payload } = event.data;
      
      if (type === 'ready') {
        // Sandbox is ready, send the initial code
        iframeRef.current?.contentWindow?.postMessage({
          type: 'compile',
          payload: { code }
        }, '*');
      } else if (type === 'error') {
        setError(payload?.error || 'Unknown error');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [code]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/sandbox.html"
        style={{
          width: '100%',
          height: error ? 'calc(100% - 60px)' : '100%',
          border: 'none',
          backgroundColor: 'white',
        }}
        sandbox="allow-scripts allow-same-origin"
        title="Preview"
      />
    </div>
  );
};

export default Preview;
