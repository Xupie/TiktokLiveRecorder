import config from "../config/config";
import { DEFAULT_HEADERS } from "../constants/appConstants";
import loadCookie, { isCookiesEmpty } from "./cookieUtils";

/**
 * @param url
 * @returns 
 */
export async function fetchSite(url: string): Promise<string> {
    const response: Response = await fetch(url, { headers: DEFAULT_HEADERS });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
}

/**
 * @param url
 * @returns 
 */
export async function fetchJSON<T>(url: string): Promise<T> {
    let response;
    if (config.use_cookie && !await isCookiesEmpty()) {
        response = await fetch(url, {
            headers: {
                "Cookie": await loadCookie(),
            }
        });
    } else {
        response = await fetch(url, {
            headers: DEFAULT_HEADERS
        });
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}