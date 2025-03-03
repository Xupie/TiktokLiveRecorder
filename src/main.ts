import fs from 'node:fs/promises';
import toml from 'toml';
import validateAndLoadConfig from './config/ConfigValidator';
import { checkIfBlacklisted, checkIfLive, getRoomID, getStreamURL } from './services/tiktokService';
import retry from './services/retryService';
import startRecording from './services/recordingService';
import loadCookie from './utils/cookieUtils';
import { CONFIG_FILE_PATH } from './constants/appConstants';

(async () => {
  try {
    const tomlContent: string = await fs.readFile(CONFIG_FILE_PATH, "utf8");
    const config: Record<string, unknown> = toml.parse(tomlContent)
    console.info(config);
    const { username, retry_delay, use_cookie, cookie_path, get_cookie, output, live_quality, logging, logging_delay } = validateAndLoadConfig(config);

    if (use_cookie) await loadCookie(cookie_path, get_cookie);

    if (await retry(() => checkIfBlacklisted(username), retry_delay)) 
      return console.warn("User is blacklisted");
    
    const roomID: number | null = await retry(() => getRoomID(username), retry_delay);
    if (roomID === null) return console.warn("Failed to get room ID");

    let retryMessage: boolean = true;

    const isLive: boolean = await retry(() => checkIfLive(roomID), retry_delay);
    if (isLive) {
      retryMessage = true;
      console.info("User is live, starting recording...");
      const liveURLs = await retry(() => getStreamURL(roomID), retry_delay);
      await retry(() => startRecording(liveURLs, output, live_quality, logging, logging_delay), retry_delay);
    } 
    else {
      if (retryMessage) {
        console.info("User is not live, retrying every 30 seconds...");
        retryMessage = false;
      }
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }

  } catch (err) {
    console.error("An error occurred:", err);
  }
})();