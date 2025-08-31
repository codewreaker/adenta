import { NAME } from '../constants/index.js';
import {createJiti} from 'jiti';
import {loadConfig, createDefineConfig} from 'c12';
import { AdentaConfig, LoadOptions } from '../types/index.js';

const jiti = createJiti(import.meta.url);

const loadAdentaConfig =(opts: LoadOptions = {})=>loadConfig<AdentaConfig>({
    name: NAME,
    jiti,
    ...opts
})

const defineConfig = createDefineConfig<AdentaConfig>()


export {
    loadAdentaConfig,
    jiti,
    defineConfig
};