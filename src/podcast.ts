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


    constructor(response: PodcastResponse) {
        this.id = response.id
        this.host = response.host
        this.activeSince = response.activeSince

        this.gateway = null
        this.audioSocket = null
    }

    static create(id: number, host: string, gateway: Gateway, audioSocket: AudioSocket): Podcast {
        return new Podcast({
            id, host, activeSince: null, gateway, audioSocket
        })
    }

}