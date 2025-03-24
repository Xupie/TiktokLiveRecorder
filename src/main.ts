import { checkIfBlacklisted, checkIfLive, getRoomID, getStreamURL } from './services/tiktokService';
import retry from './services/retryService';
import startRecording from './services/recordingService';
import loadCookie from './utils/cookieUtils';
import config from './config/config';
import { sendWebhookMessage } from './utils/webhookUtils';
import { logger } from './logger';

(async () => {
  try {
    logger.info(config);
    if (config.use_cookie) await loadCookie();

    await retry(() => checkIfBlacklisted(config.username)) 
      ? logger.warn("User is blacklisted")
      : logger.info("Not Blacklisted");      
    
    const roomID: number | null = await retry(() => getRoomID(config.username));
    if (roomID === null) return logger.warn("Failed to get room ID");

    let retryMessage: boolean = true;
    while (true) {
      const isLive: boolean = await retry(() => checkIfLive(roomID));

      if (isLive) {
        retryMessage = true;
        logger.info("User is live, starting recording...");
        sendWebhookMessage(`${config.username} is live.`);
        const liveURLs = await retry(() => getStreamURL(roomID));
        await retry(() => startRecording(liveURLs));
      } 
      else {
        if (retryMessage) {
          logger.info(`User is not live, retrying every ${config.retry_delay / 1000} seconds...`);
          retryMessage = false;
        }
        await new Promise((resolve) => setTimeout(resolve, config.retry_delay));
      }
    }

  } catch (err) {
    logger.error("An error occurred:", err);
  }
})();