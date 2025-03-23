import { COOKIE_PATH, LIVE_QUALITY, LOGGING, LOGGING_DELAY, OUTPUT_DIR, RETRY_DELAY, TIKTOK_REGION } from "../constants/appConstants";
import fs from 'node:fs';

const DEFAULTS = {
    retry_delay: RETRY_DELAY,
    cookie_path: COOKIE_PATH,
    output: OUTPUT_DIR,
    region: TIKTOK_REGION,
    live_quality: LIVE_QUALITY,
    logging: LOGGING,
    logging_delay: LOGGING_DELAY,
};

export default function validateAndLoadConfig(config: Record<string, unknown>) {
    const username = getString(config, "username", "")
    if (!username) throw new Error("Configuration error: 'username' is required.");

    const retry_delay = getNumber(config, "retry_delay", DEFAULTS.retry_delay);
    const use_cookie = getBoolean(config, "use_cookie", false);
    const cookie_path = getString(config, "cookie_path", DEFAULTS.cookie_path);
    const get_cookie = getBoolean(config, "get_cookie", false);
    const output = getString(config, "output", DEFAULTS.output);
    const region = getString(config, "region", DEFAULTS.region);
    const live_quality = getString(config, "live_quality", DEFAULTS.live_quality);
    const logging = getBoolean(config, "logging", DEFAULTS.logging);
    const logging_delay = getNumber(config, "logging_delay", DEFAULTS.logging_delay);

    try {
        if (!fs.existsSync(output)) {
            fs.mkdirSync(output);
            console.info(`Output directory created: '${output}'`)
        }
    } catch (err) {
        throw new Error(`Failed to create output directory '${output}'`);
    }

    return { 
        username, 
        retry_delay, 
        use_cookie, 
        cookie_path, 
        get_cookie, 
        output, 
        live_quality,
        region,
        logging,
        logging_delay,
    };
}

function getString(config: Record<string, unknown>, key: string, defaultValue: string): string {
    return typeof config[key] === "string" && config[key]?.trim() !== "" 
        ? (config[key] as string).trim() 
        : defaultValue;
}

function getBoolean(config: Record<string, unknown>, key: string, defaultValue: boolean): boolean {
    return typeof config[key] === "boolean" 
        ? config[key] 
        : defaultValue;
}

function getNumber(config: Record<string, unknown>, key: string, defaultValue: number): number {
    return typeof config[key] === "number" && config[key] > 0 
        ? config[key] 
        : defaultValue;
}