import React, { useState } from 'react';
import { getMDXComponent } from '../../src/mdx-bundler/lib/client';

const API_URL = 'http://localhost:4000/api/mdx';

export function LiveEditorExample() {
  const [mdx, setMdx] = useState('# Hello, world!');
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCompile() {
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'raw', mdx })
      });
      const { code, error } = await res.json();
      if (error) {
        setError(error);
        setComponent(null);
        return;
      }
      setComponent(() => getMDXComponent(code));
    } catch (e: any) {
      setError(e.message);
      setComponent(null);
    }
  }

  return (
    <div>
      <h2>Live MDX Editor</h2>
      <textarea
        value={mdx}
        onChange={e => setMdx(e.target.value)}
        rows={10}
        cols={60}
        style={{ fontFamily: 'monospace', fontSize: 16 }}
      />
      <br />
      <button onClick={handleCompile} style={{ margin: '12px 0', padding: '8px 20px', fontSize: 16 }}>Compile</button>
      <div style={{ marginTop: 20 }}>
        {error && <pre style={{ color: 'red' }}>{error}</pre>}
        {Component ? <Component /> : null}
      </div>
    </div>
  );
} 