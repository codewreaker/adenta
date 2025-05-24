import type { EditorProps } from '@monaco-editor/react';

export interface FileData {
  name: string;
  language: string;
  value: string;
}

export interface SandboxProps {
  files: FileData[];
  defaultFile?: string;
  editorOptions?: EditorProps;
  height?: string;
  width?: string;
}

export interface SandboxState {
  currentFile: string;
  files: Map<string, FileData>;
  buildError?: string;
}
