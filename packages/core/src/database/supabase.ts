import { spawn } from 'child_process';
import { log } from '../logger/self-logger.js';
import { execString } from '../utils/detectPackageManager.js';
import fs from 'node:fs';
import path from 'node:path';

const KNOWN_ERRORS: Record<string, boolean> = {
  'failed to create config file: open supabase/config.toml: file exists': true,
};

function spawnAsync(commandStr: string) {
  const args: string[] = `${execString()} ${commandStr}`.split(' ');
  const command = args.shift();

  log.debug(`Running with package manager: ${command} ${args.join(' ')}`);

  if (!command) {
    throw new Error('Command is required');
  }

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('spawn', () => {
      log.start(`Running: ${command} ${args.join(' ')}`);
    });

    child.on('close', (code) => {
      if (code === 0) {
        log.success(`✅ ${command} completed`);
        resolve(`✅ ${commandStr} completed`);
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      if (KNOWN_ERRORS[error.message]) {
        log.warn(error.message);
        resolve('Non failing error');
      } else {
        reject(error);
      }
    });
  });
}

const setupSupabase = async ({ workDir = process.cwd() } = {}) => {
  // INSERT_YOUR_CODE
  log.info(`Setting up Supabase in ${workDir}`);
  const configPath = path.join(workDir, 'supabase', 'config.toml');
  const configExists = fs.existsSync(configPath);

  if (!configExists) {
    await spawnAsync(`supabase init --workdir ${workDir}`).catch((err) => {
      log.error(err);
    });
  } else {
    log.warn(`Supabase config already exists at ${path.relative(workDir, configPath)}, \nin workdir ${workDir}. Skipping init.`);
  }
  await spawnAsync('supabase start');
  await spawnAsync('supabase status');
};

export { setupSupabase };
