import {resolve} from 'pathe';
import {readFileSync} from 'node:fs'

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const PATHS = {
    get packageJson() {
        const path = resolve(__dirname, '../../package.json');
        const json = JSON.parse(readFileSync(path, 'utf8'));
        return { json, path };
    }
}