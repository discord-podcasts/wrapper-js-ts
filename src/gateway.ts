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

type EventCallback = (event: Event) => void

export class Gateway {
    url = "wss://podcasts.myra.bot"
    socket: WebSocket
    eventListeners = {
        list: new Array<EventCallback>()
    }

    constructor(authHeaders: { client_id: string, client_secret: string }) {
        this.socket = new WebSocket(`${(this.url)}/ws`, {
            headers: authHeaders
        })
        this.socket.addEventListener("message", (event) => {
            const data = event.data as string
            const incomingEvent: Event = JSON.parse(data);
            console.log(incomingEvent)
            this.eventListeners.list.forEach(callback => callback(incomingEvent))
        })
    }

    onEvent(callback: EventCallback) {
        this.eventListeners.list.push(callback)
    }

    awaitEvent(eventType: EventType): Promise<Event> {
        return new Promise<Event>((resolve, reject) => {
            // TODO Remove listener when it got called
            this.onEvent((event) => {
                if (event.t === eventType) resolve(event)
            })
        });
    }

    send(eventType: EventType, data: Object) {
        const event: Event = {
            t: eventType,
            data
        }
        this.socket.send(JSON.stringify(event), (error) => {
            if (error !== undefined) throw error
        })
    }

}