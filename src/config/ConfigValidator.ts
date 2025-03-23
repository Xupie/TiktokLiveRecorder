import { logger } from "../main";
import { COOKIE_PATH, LIVE_QUALITY, LOGGING, LOGGING_DELAY, LOGGING_DIR, LOGGING_LEVEL, OUTPUT_DIR, RETRY_DELAY, TIKTOK_REGION } from "../constants/appConstants";
import fs from 'node:fs';

const DEFAULTS = {
    retry_delay: RETRY_DELAY,
    cookie_path: COOKIE_PATH,
    use_cookie: false,
    get_cookie: false,
    output: OUTPUT_DIR,
    region: TIKTOK_REGION,
    live_quality: LIVE_QUALITY,
    logging: LOGGING,
    logging_delay: LOGGING_DELAY,
    logging_level: LOGGING_LEVEL,
    logging_dir: LOGGING_DIR,
    use_discord_webhook: false,
    webhook_url: "",
};

export default function validateAndLoadConfig(config: Record<string, unknown>) {
    const username = getString(config, "username", "")
    if (!username) throw new Error("Configuration error: 'username' is required.");

    const retry_delay = getNumber(config, "retry_delay", DEFAULTS.retry_delay);
    const output = getString(config, "output", DEFAULTS.output);

    // Cookie
    const use_cookie = getBoolean(config, "use_cookie", DEFAULTS.use_cookie);
    const cookie_path = getString(config, "cookie_path", DEFAULTS.cookie_path);
    const get_cookie = getBoolean(config, "get_cookie", DEFAULTS.get_cookie);
    
    // Live
    const region = getString(config, "region", DEFAULTS.region);
    const live_quality = getString(config, "live_quality", DEFAULTS.live_quality);
    
    // Logging
    const logging = getBoolean(config, "logging", DEFAULTS.logging);
    const logging_delay = getNumber(config, "logging_delay", DEFAULTS.logging_delay);
    const logging_level = getString(config, "logging_level", DEFAULTS.logging_level);
    const logging_dir = getString(config, "logging_dir", DEFAULTS.logging_dir);
    
    // Discord webhook
    const use_discord_webhook = getBoolean(config, "use_discord_webhook", DEFAULTS.use_discord_webhook);
    const webhook_url = getString(config, "webhook_url", DEFAULTS.webhook_url);

    try {
        if (!fs.existsSync(output)) {
            fs.mkdirSync(output);
            logger.info(`Output directory created: '${output}'`)
        }
        if (logging && !fs.existsSync("./logs")) {
            fs.mkdirSync("./logs");
            logger.info(`Output directory created: '${output}'`)
        }
    } catch (err) {
        throw new Error(`Failed to create output directory. ${err}`);
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
        logging_level,
        logging_dir,
        use_discord_webhook,
        webhook_url,
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