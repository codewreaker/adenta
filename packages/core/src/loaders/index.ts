import { NAME } from '../constants/index.ts';
import {createJiti} from 'jiti';
import {loadConfig} from 'c12';
import {logger} from "../logger/index.ts"

const jiti = createJiti(import.meta.url);
const log = logger('@adenta/sandbox')


const {config } = await loadConfig({
    name: NAME,
    jiti
})


log.info(config);

export default config;