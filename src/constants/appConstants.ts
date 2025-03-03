export const RETRY_DELAY: number = 5000;
export const COOKIE_PATH: string = "./cookie.json";
export const CONFIG_FILE_PATH: string = "./config.toml";

export const TIKTOK_BASE_URL: string = "https://www.tiktok.com";
export const TIKTOK_LIVE_URL: (username: string) => string = (username) =>
    `${TIKTOK_BASE_URL}/@${username}/live`;
export const TIKTOK_CHECK_ALIVE_URL: (roomID: number) => string = (roomID) =>
    `https://webcast.tiktok.com/webcast/room/check_alive/?aid=1988&region=${TIKTOK_REGION}&room_ids=${roomID}&user_is_login=true`;
export const TIKTOK_ROOM_INFO_URL: (roomID: number) => string = (roomID) =>
    `https://webcast.tiktok.com/webcast/room/info/?aid=1988&region=${TIKTOK_REGION}&room_id=${roomID}`;

export const TIKTOK_REGION: string = "FI";

export const DEFAULT_HEADERS: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Accept-Language": "en-US,en;q=0.9",
}

export const OUTPUT_DIR: string = "./recordings";

export const LIVE_QUALITY: string = "highest";

export const LOGGING: boolean = true;

export const LOGGING_DELAY: number = 30;