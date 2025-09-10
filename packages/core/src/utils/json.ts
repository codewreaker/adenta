import { readFileSync } from 'node:fs';

export const readJsonFile = (path: string) => (JSON.parse(readFileSync(path, 'utf8')));