import {isDevelopment} from 'std-env'

export const isDev = Boolean(isDevelopment || process.env?.PREPROD)