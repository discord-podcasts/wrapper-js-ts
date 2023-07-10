import {CommandInteraction} from "discord.js";
import {joinVoiceChannel} from "@discordjs/voice";
import {encryptionSecret} from "../src/index.js";
import {client, discordPodcasts, ip} from "./index.js";

export async function listenPodcast(interaction: CommandInteraction) {
    if (interaction.guild === null) return

    const channel = client.guilds.cache.get("851809328650518568")?.channels.cache.get("876079099943202926")
    if (channel === undefined || !channel.isVoiceBased) return await interaction.reply("Channel not found")

    const podcastId = interaction.options.get("id")?.value as number
    const podcast = await discordPodcasts.getPodcast(podcastId)
    if (podcast === null) return await interaction.reply("Invalid ID")

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator
    })

    await podcast.connect(discordPodcasts.clientId, discordPodcasts.clientSecret, encryptionSecret, ip)
    podcast.audioSocket?.onPacket(audio => {
        console.log("Received a packet")
        connection.playOpusPacket(Buffer.from(audio))
    })

    await interaction.reply("Playing")
}