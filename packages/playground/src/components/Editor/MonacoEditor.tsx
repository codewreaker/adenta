import * as React from 'react';
import Editor from '@monaco-editor/react';
import { FileTab } from '../types';
import './Editor.css';

interface MonacoEditorProps {
  file: FileTab;
  onContentChange: (content: string) => void;
}

export const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({ file, onContentChange }) => {
  return (
    <div className="editor-container">
      <Editor
        height="100%"
        defaultLanguage={file.language}
        value={file.content}
        theme="vs-dark"
        onChange={(value) => onContentChange(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};
