
import {
    defineConfig
} from '../src/loaders/index.ts'

const loadedConfig = defineConfig({
    name: 'adenta-example',
    meta:{
        logLevel: 3
    }
});


export default loadedConfig;