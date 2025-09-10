import { log } from "./logger/self-logger.js";

export async function handleErrors(
    isVerbose: boolean,
    fn: Function
): Promise<number> {
    try {
        const result = await fn();
        if (typeof result === 'number') {
            return result;
        }
        return 0;
    } catch (err) {
        log.error(err);
        return 1
    }
}