import React, { useCallback, useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FileData, SandboxProps, SandboxState } from './types';
import { initBuildWorker, terminateBuildWorker } from './worker';
import { PREVIEW_URL } from './preview';

const DEFAULT_HEIGHT = '100vh';
const DEFAULT_WIDTH = '100%';

export const Sandbox: React.FC<SandboxProps> = ({
  files: initialFiles,
  defaultFile,
  editorOptions,
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
}) => {
  const [state, setState] = useState<SandboxState>(() => {
    const filesMap = new Map<string, FileData>();
    initialFiles.forEach(file => filesMap.set(file.name, file));
    return {
      currentFile: defaultFile || initialFiles[0].name,
      files: filesMap,
    };
  });

  const buildTimeoutRef = useRef<NodeJS.Timeout>();
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Initialize preview iframe
    if (previewIframeRef.current) {
      previewIframeRef.current.src = PREVIEW_URL;
    }

    // Initialize build worker
    const worker = initBuildWorker();
    
    // Set up message listeners
    const handleWorkerMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'build-error') {
        setState(prev => ({ ...prev, buildError: payload.error }));
      } else if (type === 'build-success') {
        setState(prev => ({ ...prev, buildError: undefined }));
        // Send bundle to preview iframe
        previewIframeRef.current?.contentWindow?.postMessage({
          type: 'update-preview',
          payload: { bundle: payload.bundle }
        }, '*');
      }
    };

    const handlePreviewMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'preview-error') {
        setState(prev => ({ ...prev, buildError: payload.error }));
      }
    };

    worker.addEventListener('message', handleWorkerMessage);
    window.addEventListener('message', handlePreviewMessage);

    return () => {
      worker.removeEventListener('message', handleWorkerMessage);
      window.removeEventListener('message', handlePreviewMessage);
      terminateBuildWorker();
    };
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value) return;

    // Update file content
    setState(prev => {
      const newFiles = new Map(prev.files);
      const currentFile = newFiles.get(prev.currentFile);
      if (currentFile) {
        newFiles.set(prev.currentFile, {
          ...currentFile,
          value,
        });
      }
      return { ...prev, files: newFiles };
    });

    // Debounce build
    if (buildTimeoutRef.current) {
      clearTimeout(buildTimeoutRef.current);
    }

    buildTimeoutRef.current = setTimeout(() => {
      // Trigger build via worker
      const worker = initBuildWorker();
      worker.postMessage({
        type: 'build-request',
        payload: {
          files: Array.from(state.files.values()),
        },
      });
    }, 1000);
  }, [state.files]);

  const currentFile = state.files.get(state.currentFile);

  return (
    <div style={{ display: 'flex', height, width }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          padding: '0.5rem', 
          borderBottom: '1px solid #ccc' 
        }}>
          {Array.from(state.files.keys()).map(filename => (
            <button
              key={filename}
              onClick={() => setState(prev => ({ ...prev, currentFile: filename }))}
              style={{
                background: filename === state.currentFile ? '#e0e0e0' : 'transparent',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              {filename}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {currentFile && (
            <Editor
              height="100%"
              language={currentFile.language}
              value={currentFile.value}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                ...editorOptions,
              }}
            />
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {state.buildError ? (
            <pre style={{ 
              margin: 0, 
              padding: '1rem', 
              background: '#fee', 
              color: '#c00',
              whiteSpace: 'pre-wrap'
            }}>
              {state.buildError}
            </pre>
          ) : (
            <iframe 
              ref={previewIframeRef}
              src="about:blank"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
