import React, { useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { LiveEditorProps } from './types';
import Preview from './Preview';
import { transformCode } from './transform';

const DEFAULT_CODE = `import React from 'react';

export const App = () => {
  return (
    <div>
      <h1>Hello from LiveEditor!</h1>
      <p>Start editing to see your changes</p>
    </div>
  );
};`;

const LiveEditor: React.FC<LiveEditorProps> = ({
  defaultValue = DEFAULT_CODE,
  onChange,
  height = '100vh',
  width = '100%',
  theme = 'vs-dark',
}) => {
  const [transformedCode, setTransformedCode] = useState('');

  const handleEditorChange = useCallback(async (value: string | undefined) => {
    if (!value) return;
    
    onChange?.(value);

    try {
      const transformed = await transformCode(value);
      setTransformedCode(transformed);
    } catch (error) {
      console.error('Transformation error:', error);
    }
  }, [onChange]);

  useEffect(() => {
    handleEditorChange(defaultValue);
  }, [defaultValue, handleEditorChange]);

  return (
    <div style={{ display: 'flex', height, width }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <Editor
          height="100%"
          defaultLanguage="typescript"
          defaultValue={defaultValue}
          theme={theme}
          onChange={(value: string | undefined) => handleEditorChange(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Preview code={transformedCode} />
      </div>
    </div>
  );
};

export default LiveEditor;