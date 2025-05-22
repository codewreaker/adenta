import React, { useEffect, useRef, useState } from 'react';
import { PreviewProps, SandboxMessage } from './types';
import { SANDBOX_DATA_URL } from './sandboxUrl';

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sandboxUrl, setSandboxUrl] = useState(() => SANDBOX_DATA_URL);

  useEffect(() => {
    // If SANDBOX_DATA_URL wasn't ready during initial state, set it now
    if (!sandboxUrl && SANDBOX_DATA_URL) {
      setSandboxUrl(SANDBOX_DATA_URL);
    }
  }, [sandboxUrl]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<SandboxMessage>) => {
      const { type, payload } = event.data;

      if (type === 'ready') {
        setIsReady(true);
      } else if (type === 'error') {
        setError(payload?.error || 'Unknown error');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (isReady) {
      // Sandbox is ready, send the initial code
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'compile',
          payload: { code },
        },
        '*'
      );
    }
  }, [isReady, code]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<SandboxMessage>) => {
      const { type, payload } = event.data;

      if (type === 'ready') {
        // Sandbox is ready, send the initial code
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: 'compile',
            payload: { code },
          },
          '*'
        );
      } else if (type === 'error') {
        setError(payload?.error || 'Unknown error');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [code]);

  if (!sandboxUrl) {
    return <div>Loading sandbox...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {error && <div className="error">{error}</div>}
      <iframe
        ref={iframeRef}
        src={sandboxUrl}
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
