import fs from 'node:fs';
import { readFile } from 'node:fs/promises';

let COOKIE_PATH = "";

export default async function loadCookie(path: string, get_cookie: boolean): Promise<string> {
    COOKIE_PATH = path;
    if (!fs.existsSync(path)) fs.writeFile(path, "[]", err => {
        if (err) console.error(err);
        console.log("Created cookie file.");
    });

    if (get_cookie) await getCookies();

    let cookieSTR = new TextDecoder().decode(await readFile(path))
    const cookieJson = await JSON.parse(cookieSTR) as { name: string, value: string }[];
    cookieSTR = cookieJson
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");
    return cookieSTR;
}

export async function isCookiesEmpty() {
    let cookieSTR = new TextDecoder().decode(await readFile("./cookie.json"));
    if (cookieSTR == "" || cookieSTR == "[]") return true;
    else return false;
}

async function getCookies() {
    
}