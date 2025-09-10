import {resolve} from 'pathe';
import {readFileSync} from 'node:fs'

export const PATHS = {
    get packageJson() {
        const path = resolve('./package.json');
        const json = JSON.parse(readFileSync(path, 'utf8'));
        return { json, path };
    }
}