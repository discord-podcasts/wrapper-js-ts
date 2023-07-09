import {ListPodcastsResponse, Podcast, PodcastResponse} from "./podcast.js";
import {ConnectedEvent, EventType, Gateway, HelloEvent} from "./gateway.js";
import {AudioSocket} from "./audio-socket.js";

const rest = "https://podcasts.myra.bot"

class DiscordPodcasts {
    clientId = "123"
    clientSecret = "nR2ZtDixLiz4BmMNF1Mz8K7n3EajRzHa"

    getAuthHeaders() {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret
        }
    }

    async getPodcast(id: number): Promise<Podcast | null> {
        const result = await fetch(`${rest}?podcast=${id}`, {
            headers: this.getAuthHeaders()
        })
        if (result.status === 200) {
            const response: PodcastResponse = await result.json()
            return new Podcast(response)
        } else if (result.status === 404) {
            return null
        } else {
            throw new Error("Unexpected response: " + result)
        }
    }

    async listPodcasts(): Promise<Podcast[] | null> {
        const result = await fetch(`${rest}/list`, {
            headers: this.getAuthHeaders()
        })
        if (result.status === 200) {
            const response: ListPodcastsResponse = await result.json()
            return response.podcasts.map(podcast => new Podcast(podcast))
        } else if (result.status === 404) {
            return null
        } else {
            throw new Error("Unexpected response: " + result)
        }
    }

    async createPodcast(ip: string): Promise<Podcast> {
        const gateway = new Gateway(this.getAuthHeaders())
        gateway.onEvent(event => {
            console.log("gateway event")
            console.log(event)
        })

        const helloEvent = await gateway.awaitEvent(EventType.HELLO)
            .then(event => event.data as HelloEvent)

        const audioSocket = await AudioSocket.create()
        gateway.send(EventType.CONNECTED, {ip, port: audioSocket.port} as ConnectedEvent)
        const clientJoinEvent = await gateway.awaitEvent(EventType.CLIENT_JOIN)

        const podcast = Podcast.create(
            helloEvent.podcast_id,
            this.clientId,
            gateway,
            audioSocket
        )
        return podcast
    }

}

async function main() {
    const ip = ""

    const discordPodcasts = new DiscordPodcasts()
    const createdPodcast = await discordPodcasts.createPodcast(ip)
    console.log(createdPodcast)

    const fetchedPodcast = await discordPodcasts.listPodcasts()
    console.log(fetchedPodcast)
}

await main()