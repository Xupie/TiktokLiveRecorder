import config from "../config/config";

export async function sendWebhookMessage(message: string) {
    if (!config.use_discord_webhook) return;

    // https://discord.com/developers/docs/resources/webhook#execute-webhook
    await fetch(config.webhook_url, {
        method: "POST",
        headers: {
          'Content-type': "application/json"
        },
        body: JSON.stringify({
            username: config.username,
            //avatar_url: ""
            content: message
        }),
    });
}