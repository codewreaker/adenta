import { API_BASE } from '../api';

export async function fetchMdxApi(body: any) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
} 