import {DiscordPodcasts} from "../src/index.js";

async function main() {
    const ip = ""

    const discordPodcasts = new DiscordPodcasts()
    const createdPodcast = await discordPodcasts.createPodcast(ip)
    console.log(createdPodcast)

    const fetchedPodcast = await discordPodcasts.getPodcast(createdPodcast.id)
    console.log(fetchedPodcast)
}

await main()