import fs from 'node:fs';
import { readFile } from 'node:fs/promises';

export let COOKIE_PATH = "";
export let GET_COOKIE = false;

export default async function loadCookie(path: string, get_cookie: boolean): Promise<string> {
    COOKIE_PATH = path;
    GET_COOKIE = get_cookie;
    if (!fs.existsSync(path)) fs.writeFile(path, "[]", err => {
        if (err) console.error(err);
        console.log("Created cookie file.");
    });

    if (get_cookie && await isCookiesEmpty()) await getCookies();

    let cookieSTR = new TextDecoder().decode(await readFile(path))
    const cookieJson = await JSON.parse(cookieSTR) as { name: string, value: string }[];
    cookieSTR = cookieJson
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");
    return cookieSTR;
}

export async function isCookiesEmpty() {
    let cookieSTR = new TextDecoder().decode(await readFile("./cookie.json"));
    return cookieSTR == "" || cookieSTR == "[]" ? true : false   
}

async function getCookies() {
    
}