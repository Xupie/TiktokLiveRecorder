import { sendWebhookMessage } from '../utils/webhookUtils';
import config from '../config/config';
import fs from 'node:fs/promises';

export default async function startRecording(urls: string[]) {
    try {
        const url = await getQuality(config.live_quality, urls);
        const response = await fetch(url)
        const rdr = response.body?.getReader();
        if (!rdr) throw new Error("Failed to read response body");

        const startTime = Date.now();
        const name = `${new Date().toISOString()
            .replace(/:/g, "-")
            .replace(/\..+$/, "")}.flv`;
        
        const fileHandle = await fs.open(`${config.output}/${name}`, "w");
        const writer = fileHandle.createWriteStream();

        // Closes file if getting shutdown signal
        ["SIGINT", "SIGTERM", "SIGHUP", "uncaughtException", "exit"].forEach((signal) => {
            process.on(signal, (err) => {
                console.info("Closing file...")
                if (writer) writer.close();
                if (signal === "uncaughtException") console.error(err);
                process.exit();
            });
        });
        process.stdin.resume();

        try {
            let totalBytes = 0;
            let lastElapsedTime = 0;
            console.info("Recording started...");
            
            while (true) {
                const { value: chunk, done } = await rdr.read();
                if (done) break;

                totalBytes += chunk?.length || 0;
                writer.write(chunk);

                if (config.logging) {
                    const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
                    if (elapsedTime - lastElapsedTime >= config.logging_delay) {
                        lastElapsedTime = elapsedTime;
                        const hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
                        const minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
                        const seconds = Math.floor(elapsedTime % 60).toString().padStart(2, '0');
                        console.info(`[${hours}:${minutes}:${seconds}] ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
                    }
                }
            }
        } finally {
            writer.close();
            console.info("Recording finished");
            sendWebhookMessage(`${config.username}'s live ended.`);
        }
    } catch (err) {
        console.error("An error occurred while recording:", err);
    }
}

async function getQuality(quality: string , urls: string[]): Promise<string> {
    switch (quality) {
        case "highest":
            return urls[0];

        case "medium":
            return urls[Math.floor(urls.length - urls.length / 2)];

        case "lowest":
            return urls[urls.length - 1];

        default: 
            return urls[0];
    }
    
}