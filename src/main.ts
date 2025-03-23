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

    await retry(() => checkIfBlacklisted(config.username), config.retry_delay) 
      ? logger.warn("User is blacklisted")
      : logger.info("Not Blacklisted");      
    
    const roomID: number | null = await retry(() => getRoomID(config.username), config.retry_delay);
    if (roomID === null) return logger.warn("Failed to get room ID");

    let retryMessage: boolean = true;
    while (true) {
      const isLive: boolean = await retry(() => checkIfLive(roomID), config.retry_delay);

      if (isLive) {
        retryMessage = true;
        logger.info("User is live, starting recording...");
        sendWebhookMessage(`${config.username} is live.`);
        const liveURLs = await retry(() => getStreamURL(roomID), config.retry_delay);
        await retry(() => startRecording(liveURLs), config.retry_delay);
      } 
      else {
        if (retryMessage) {
          logger.info("User is not live, retrying every 30 seconds...");
          retryMessage = false;
        }
        await new Promise((resolve) => setTimeout(resolve, 30000));
      }
    }

  } catch (err) {
    logger.error("An error occurred:", err);
  }
})();