import { COOKIE_PATH, LIVE_QUALITY, OUTPUT_DIR, RETRY_DELAY } from "../constants/appConstants";
import fs from 'node:fs';

export default function validateAndLoadConfig(config: Record<string, unknown>): { 
        username: string; 
        retry_delay: number; 
        use_cookie: boolean;
        cookie_path: string;
        get_cookie: boolean;
        output: string; 
        live_quality: string;
    } {
    const username = typeof config.username === "string" ? config.username.trim() : "";
    if (username == "") throw new Error("Configuration error: 'username' is required.");

    const retry_delay = typeof config.retry_delay === "number" && config.retry_delay > 0 
        ? config.retry_delay 
        : RETRY_DELAY;

    const use_cookie = config.use_cookie === true;
    const cookie_path = typeof config.cookie_path === "string" && config.cookie_path.trim() !== "" 
        ? config.cookie_path 
        : COOKIE_PATH;

    const get_cookie = config.get_cookie === true;

    const output = typeof config.output === "string" && config.output.trim() !== "" 
        ? config.output 
        : OUTPUT_DIR;

    try {
        if (!fs.existsSync(output)) {
            fs.mkdirSync(output);
            console.info(`Output directory created: '${output}'`)
        }
    } catch (err) {
        throw new Error(`Failed to create output directory '${output}'`);
    }

    const live_quality = typeof config.live_quality === "string" && config.live_quality.trim() !== "" 
        ? config.live_quality
        : LIVE_QUALITY;

    return { 
        username, 
        retry_delay, 
        use_cookie, 
        cookie_path, 
        get_cookie, 
        output, 
        live_quality 
    };
}