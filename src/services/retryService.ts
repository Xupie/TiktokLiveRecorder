export default async function retry<T>(fn: () => Promise<T>, delay: number): Promise<T> {
    let attempt = 0;
    while (true) {
        try {
            return await fn();
        } catch (err) {
            attempt++;
            console.error(`Attempt ${attempt} failed. Retrying in ${delay / 1000} seconds...`, err, `\n${fn.toString()}`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}