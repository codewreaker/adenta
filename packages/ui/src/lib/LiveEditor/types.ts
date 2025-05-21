export interface LiveEditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  width?: string | number;
  theme?: 'vs-dark' | 'light';
}

export interface PreviewProps {
  code: string;
  dependencies?: Record<string, string>;
}

export interface SandboxMessage {
  type: 'compile' | 'error' | 'ready';
  payload?: {
    code?: string;
    error?: string;
  };
}
