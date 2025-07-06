import React, { useState } from 'react';
import { LocalFilesExample } from './LocalFilesExample';
import { GithubRemoteExample } from './GithubRemoteExample';
import { LiveEditorExample } from './LiveEditorExample';

const EXAMPLES = [
  { name: 'Local Files', component: <LocalFilesExample /> },
  { name: 'GitHub Remote', component: <GithubRemoteExample /> },
  { name: 'Live Editor', component: <LiveEditorExample /> },
];

export function App() {
  const [selected, setSelected] = useState(0);
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>MDX Bundler Examples</h1>
      <nav style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.name}
            onClick={() => setSelected(i)}
            style={{
              margin: 8,
              padding: '10px 24px',
              background: i === selected ? '#333' : '#eee',
              color: i === selected ? '#fff' : '#333',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: i === selected ? '0 2px 8px #0002' : undefined,
              transition: 'all 0.2s',
            }}
          >
            {ex.name}
          </button>
        ))}
      </nav>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 32, background: '#fafbfc', minHeight: 300 }}>
        {EXAMPLES[selected].component}
      </div>
      <footer style={{ marginTop: 40, textAlign: 'center', color: '#888' }}>
        Powered by <a href="https://github.com/kentcdodds/mdx-bundler" target="_blank" rel="noopener noreferrer">mdx-bundler</a> & Hono.js
      </footer>
    </div>
  );
} 