import { logger } from '../main';
import config from '../config/config';
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';

import { Browser, Builder, By, Key, WebDriver } from 'selenium-webdriver';

export default async function loadCookie(): Promise<string> {
    if (!fs.existsSync(config.cookie_path)) fs.writeFile(config.cookie_path, "[]", err => {
        if (err) logger.error(err);
        logger.info("Created cookie file.");
    });

    if (config.get_cookie && await isCookiesEmpty()) await getCookies();

    let cookieSTR = new TextDecoder().decode(await readFile(config.cookie_path))
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