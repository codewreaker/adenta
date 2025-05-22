export interface FileTab {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface EditorState {
  files: FileTab[];
  activeFileId: string | null;
}

export const SUPPORTED_LANGUAGES = [
  { id: 'typescript', name: 'TypeScript', extensions: ['.ts', '.tsx'] },
  { id: 'javascript', name: 'JavaScript', extensions: ['.js', '.jsx'] },
  { id: 'css', name: 'CSS', extensions: ['.css'] },
  { id: 'html', name: 'HTML', extensions: ['.html'] },
  { id: 'json', name: 'JSON', extensions: ['.json'] },
  { id: 'markdown', name: 'Markdown', extensions: ['.md'] },
] as const;

export const getLanguageFromFileName = (fileName: string): string => {
  const ext = fileName.slice(fileName.lastIndexOf('.'));
  const lang = SUPPORTED_LANGUAGES.find(l => l.extensions.includes(ext));
  return lang?.id || 'plaintext';
};
