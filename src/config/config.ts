import fs from "fs";
import toml from "toml";
import { CONFIG_FILE_PATH } from "../constants/appConstants";
import validateAndLoadConfig from "./ConfigValidator";
import { logger } from "../logger";

let configData: Record<string, unknown>;

try {
    const tomlContent = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
    configData = toml.parse(tomlContent);
} catch (err) {
    logger.error("Failed to load config:", err);
    process.exit(1);
}

const config = validateAndLoadConfig(configData);

export default config;