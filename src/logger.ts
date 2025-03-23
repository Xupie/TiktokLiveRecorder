import { destination, pino } from 'pino';
import path from 'path';
import fs from 'fs';
import config from './config/config';

if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs", { recursive: true });
}

export const logger = pino({
    level: 'info',
    redact: {
      paths: ["webhook_url", "tiktok_username", "tiktok_password"],
    },
    transport: {
        targets: [
            {
                level: 'trace',
                target: 'pino/file',
                options: { 
                    destination: path.join("./logs", `${new Date(Date.now()).toISOString().split(":")[0]}.log`),
                },
            },
            {
                level: 'trace',
                target: 'pino-pretty',
                options: {},
            },
        ],
    },
  },
);
