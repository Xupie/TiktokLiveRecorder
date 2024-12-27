import { DEFAULT_HEADERS } from "../constants/appConstants";
import { isCookiesEmpty } from "./cookieUtils";

export async function fetchSite(url: string): Promise<string> {
    const response: Response = await fetch(url, { headers: DEFAULT_HEADERS });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
}

//TODO: Add cookie
export async function fetchJSON<T>(url: string): Promise<T> {
    let response;
    if (!isCookiesEmpty()) {
        response = await fetch(url, {
            headers: DEFAULT_HEADERS
        });
    } else {
        response = await fetch(url, {
            headers: DEFAULT_HEADERS
        });
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}