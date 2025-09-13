import { NAME } from '../constants/index.js';
import {createJiti} from 'jiti';
import {loadConfig, createDefineConfig} from 'c12';
import { LoadOptions } from '../types/index.js';
import { ProjectConfiguration } from '../command-lib/project-graph/types.js';

const jiti = createJiti(import.meta.url);

const loadAdentaConfig =(opts: LoadOptions = {})=>loadConfig<ProjectConfiguration>({
    name: NAME,
    jiti,
    ...opts
})

const defineConfig = createDefineConfig<ProjectConfiguration>()


export {
    loadAdentaConfig,
    jiti,
    defineConfig
};