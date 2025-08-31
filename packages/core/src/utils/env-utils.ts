import { isNode, isDeno, isBun, hasWindow } from 'std-env'

export const isBrowser = hasWindow && !(isNode || isDeno || isBun);
