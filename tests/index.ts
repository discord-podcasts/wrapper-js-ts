import {DiscordPodcasts} from "../src/index.js";
import {Client, Events, GatewayIntentBits} from "discord.js";
import {hostPodcast} from "./host.js";
import {listenPodcast} from "./client.js";

const token = BOT_TOKEN
export const discordPodcasts = await DiscordPodcasts.create()
export const ip = await fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(res => res.ip)
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return
    const name = interaction.commandName
    if (name === "host") await hostPodcast(interaction)
    else if (name === "listen") await listenPodcast(interaction)
});

await client.login(token);