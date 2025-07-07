import React, { useEffect, useState } from 'react';
import { getMDXComponent } from '../../src/mdx-bundler/lib/client';

const API_URL = 'http://localhost:4000/api/mdx';


export function LocalFilesExample() {
  const [Component, setComponent] = useState<ReturnType<typeof getMDXComponent> | null>(null);
  const [error, setError] = useState<string | Error | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'local', slug: 'hello' })
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
    
    load();
  }, []);
  return (
    <div>
      <h2>Local MDX File</h2>
      {error && <pre style={{ color: 'red' }}>{String(error)}</pre>}
      {Component ? <Component onError={setError}/> : <div>Loading...</div>}
    </div>
  );
} 