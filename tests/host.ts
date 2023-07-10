import {CommandInteraction} from "discord.js";
import {EndBehaviorType, joinVoiceChannel} from "@discordjs/voice";
import {client, discordPodcasts, ip} from "./index.js";
import {EventType} from "../src/gateway.js";

export async function hostPodcast(interaction: CommandInteraction) {
    if (interaction.guild === null) return
    const channel = client.guilds.cache.get("985538729269690429")?.channels.cache.get("985609815738957894")
    if (channel === undefined || !channel.isVoiceBased) return await interaction.reply("Channel not found")

    const podcast = await discordPodcasts.createPodcast(ip)
    v // <- just so you get an error and read this lol
    // This doesn't get fired...
    podcast.gateway!!.onEvent((event) => {
        console.log("YES FUCK YES");
    })

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        selfDeaf: false,
        selfMute: true,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })
    const silentFrame = new Uint8Array([0xF8, 0xFF, 0xFE]);
    connection.prepareAudioPacket(Buffer.from(silentFrame))
    connection.dispatchAudio()

    const receiver = connection.receiver;

    receiver.speaking.on("start", userId => {
        const stream = receiver.subscribe(userId, {
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 100,
            },
        })

        const nonce = receiver.connectionData.nonceBuffer!!
        const secret = receiver.connectionData.secretKey!!
        stream.on("data", (chunk) => {
            podcast?.audioSocket?.send(chunk, nonce, secret)
        })

    })
    await interaction.reply("```json\n" + podcast.toShortString() + "\n```")
}