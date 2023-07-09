import WebSocket from "ws";

interface Event {
    t: EventType,
    data: Object
}

export enum EventType {
    HELLO = 1,
    CONNECTED = 2,
    DISCONNECTED = 3,
    CLIENT_JOIN = 4,
    END = 5
}

export interface HelloEvent {
    podcast_id: number
    port: number
}

export interface ConnectedEvent {
    ip: string,
    port: number
}

export class Gateway {
    url = "wss://podcasts.myra.bot"
    socket: WebSocket
    eventCallbacks: Array<(event: Event) => void>

    constructor(authHeaders: { client_id: string, client_secret: string }) {
        this.socket = new WebSocket(`${(this.url)}/ws`, {
            headers: authHeaders
        })
        this.eventCallbacks = []

        this.socket.onmessage = (event) => {
            const incomingMessage = event.data as string
            const incomingEvent: Event = JSON.parse(incomingMessage)
            this.eventCallbacks.forEach(callback => {
                callback(incomingEvent)
            })
        }
    }

    onEvent(callback: (event: Event) => void) {
        this.eventCallbacks.push(callback)
    }

    awaitEvent(eventType: EventType): Promise<Event> {
        return new Promise((resolve) => {
            this.onEvent(event => {
                if (event.t === eventType) {
                    resolve(event)
                }
            })
        })
    }

    send(eventType: EventType, data: Object) {
        const event: Event = {
            t: eventType,
            data
        }
        this.socket.send(JSON.stringify(event), (error) => {
            console.log(error)
        })
    }

}