import { DEFAULT_HEADERS } from "../constants/appConstants";
import loadCookie, { isCookiesEmpty } from "./cookieUtils";

export async function fetchSite(url: string): Promise<string> {
    const response: Response = await fetch(url, { headers: DEFAULT_HEADERS });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
}

export async function fetchJSON<T>(url: string): Promise<T> {
    let response;
    if (!await isCookiesEmpty()) {
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