import React, { useEffect, useState } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';

const API_URL = 'http://localhost:4000/api/mdx';

export function GithubRemoteExample() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'github',
            owner: 'codewreaker',
            repo: 'docs',
            path: 'blogs/building-my-website.mdx'
          })
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
      <h2>GitHub Remote MDX</h2>
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      {Component ? <Component /> : <div>Loading...</div>}
    </div>
  );
} 