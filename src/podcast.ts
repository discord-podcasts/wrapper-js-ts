import {ConnectedEvent, EventType, Gateway, HelloEvent} from "./gateway.js";
import {AudioSocket} from "./audio-socket.js";

export interface PodcastResponse {
    id: number
    host: string
    activeSince: number | null

    gateway: Gateway | null
    audioSocket: AudioSocket | null
}

export interface ListPodcastsResponse {
    podcasts: Podcast[]
}

export class Podcast {
    id: number
    host: string
    activeSince: number | null

    gateway: Gateway | null
    audioSocket: AudioSocket | null

    constructor(id: number, host: string, activeSince: number | null, gateway: Gateway | null, audioSocket: AudioSocket | null) {
        this.id = id
        this.host = host
        this.activeSince = activeSince
        this.gateway = gateway
        this.audioSocket = audioSocket
    }

    static createFromResponse(response: PodcastResponse): Podcast {
        return new Podcast(response.id, response.host, response.activeSince, null, null);
    }

    // TODO dont put credentials as params
    public async connect(clientId: string, clientSecret: string, encryptionSecret: Uint8Array, ip: string) {
        const gateway = new Gateway({client_id: clientId, client_secret: clientSecret})

        const helloEvent = await gateway.awaitEvent(EventType.HELLO)
            .then(event => event.data as HelloEvent)

        const audioSocket = await AudioSocket.create(helloEvent.port, encryptionSecret)
        gateway.send(EventType.CONNECTED, {ip, port: audioSocket.port} as ConnectedEvent)
        const clientJoinEvent = await gateway.awaitEvent(EventType.CLIENT_JOIN)

        this.gateway = gateway
        this.audioSocket = audioSocket
    }

    public toShortString(): string {
        return `
            id: ${this.id}
            host: ${this.host}
            activeSince: ${this.activeSince}
            
            ws connected: ${this.gateway != null}
            udp connected: ${this.audioSocket != null}
        `.replace(/^ +/gm, '')
    }

}