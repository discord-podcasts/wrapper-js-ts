import {Gateway} from "./gateway.js";
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