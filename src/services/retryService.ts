import { logger } from "../main";

/**
 * @param fn Function
 * @param delay Delay of next retry
 * @returns Function if it ran successfully
 */
export default async function retry<T>(fn: () => Promise<T>, delay: number): Promise<T> {
    let attempt = 0;
    while (true) {
        try {
            return await fn();
        } catch (err) {
            attempt++;
            logger.error(`Attempt ${attempt} failed. Retrying in ${delay / 1000} seconds...`, err, `\n${fn.toString()}`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}