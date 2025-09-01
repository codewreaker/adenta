import {spawn} from 'child_process'
import { log } from '../logger/self-logger.js';
import { execString } from '../utils/detectPackageManager.js';

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
       })
      
      child.on('close', (code) => {
        if (code === 0) {
          log.success(`✅ ${command} completed`);
          resolve(`✅ ${command} completed`);
        } else {
          log.error(`❌ ${command} failed`);
          reject(new Error(`${command} exited with code ${code}`));
        }
      });
      
      child.on('error', reject);
    });
  }

(async () => {
  await spawnAsync('supabase init')
  await spawnAsync('supabase start')
  await spawnAsync('supabase status')
})()