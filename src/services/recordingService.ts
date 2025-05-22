import { sendWebhookMessage } from '../utils/webhookUtils';
import config from '../config/config';
import fs from 'node:fs/promises';
import { logger } from '../logger';
import { WriteStream } from "fs";

/**
 * Starts recording a livestream from URL
 * @param urls Stream URLs
 */
export default async function startRecording(urls: string[]) {
    let fileHandle: fs.FileHandle | null = null;
    let writer: WriteStream | null = null;
    let filePath: string = "";
    let dataWritten: boolean = false;
    let totalBytes: number = 0;

    try {
        const url = await getQuality(config.live_quality, urls);
        const response = await fetch(url)
        const rdr = response.body?.getReader();
        if (!rdr) throw new Error("Failed to read response body");

        const startTime = Date.now();
        const filename = `${new Date().toISOString()
            .replace(/:/g, "-")
            .replace(/\..+$/, "")}.flv`;
        filePath = `${config.output}/${filename}`
        
        fileHandle = await fs.open(filePath, "w");
        writer = fileHandle.createWriteStream();

        logger.info(`Recording started: ${filePath}`);

        // Shutdown Handler
        ["SIGINT", "SIGTERM", "SIGHUP", "uncaughtException", "exit"].forEach((signal) => {
            process.once(signal, (err) => {
                logger.info("Closing file...")
                if (writer) writer.close();
                if (signal === "uncaughtException") logger.error(err);
                process.exit();
            });
        });
        process.stdin.resume();

        let lastElapsedTime = Date.now();
        for await (const chunk of readStream(rdr)) {
            totalBytes += chunk.length;
            writer.write(chunk);
            dataWritten = true;

            if (config.logging) {
                const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
                if ((Date.now() - lastElapsedTime) >= config.logging_delay * 1000) {
                    lastElapsedTime = Date.now();
                    logProgress(elapsedTime, totalBytes);
                }
            }
        }
    } catch (err) {
        logger.error("An error occurred while recording:", err instanceof Error ? err.stack : err);
    } finally {
        try {
            if (writer) writer.close();
            if (fileHandle) await fileHandle.close();

            if (dataWritten) {
                if (totalBytes === 0) {
                    await fs.unlink(filePath);
                    logger.info(`No data received. Deleted empty file: ${filePath}`);
                }
                else {
                    logger.info(`Recording finished: ${filePath}`);
                }
            }
        }
        catch (error) {
            logger.error(`Failed to close: ${error}`);
        }
        sendWebhookMessage(`${config.username}'s live ended.`);
    }
}

/**
 * Reads chunks from the readable stream.
 * @param reader Readable stream reader
 */
async function* readStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
    while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        yield chunk;
    }
}

/**
 * Logs recording progress.
 * @param elapsedTime Time elapsed in seconds
 * @param totalBytes Total bytes written to file
 */
function logProgress(elapsedTime: number, totalBytes: number) {
    const hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(elapsedTime % 60).toString().padStart(2, '0');
    logger.info(`[${hours}:${minutes}:${seconds}] ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
}

/**
 * 
 * @param quality "highest", "medium", "lowest"
 * @param urls Available stream URLs.
 * @returns a stream URL
 */
async function getQuality(quality: string , urls: string[]): Promise<string> {
    switch (quality) {
        case "highest":
            return urls[0];

        case "medium":
            return urls[Math.floor(urls.length / 2)];

        case "lowest":
            return urls[urls.length - 1];

        default: 
            return urls[0];
    }
    
}