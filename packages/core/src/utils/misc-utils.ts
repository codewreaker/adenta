import fs, {readFileSync} from 'node:fs';


export function detectPackageManager() {
  // Check for lock files
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('yarn.lock')) return 'yarn';  
  if (fs.existsSync('package-lock.json')) return 'npm';
  
  // Default to npm if no lock file
  return 'npm';
}


export const execString = (pm:'npm'|'yarn'|'pnpm'=detectPackageManager()) => (({
        npm: 'npx',
        yarn: 'yarn dlx',
        pnpm: 'pnpm exec',
    })[pm] || 'npx');



export const readJsonFile = (path: string) => (JSON.parse(readFileSync(path, 'utf8')));