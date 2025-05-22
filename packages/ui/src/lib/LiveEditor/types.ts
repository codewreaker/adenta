export interface LiveEditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  width?: string | number;
  theme?: 'vs-dark' | 'light';
}

export interface PreviewProps {
  code: string;
  sandboxPath?: string;
}

export interface SandboxMessage {
  type: 'ready' | 'error';
  payload?: {
    error?: string;
  };
}
