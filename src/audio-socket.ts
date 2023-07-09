import {createSocket, Socket} from "dgram";

export class AudioSocket {
    socket: Socket;
    port: number;


    constructor(socket: Socket, port: number) {
        this.socket = socket
        this.port = port
    }


    static async create(): Promise<AudioSocket> {
        const socket = createSocket("udp4");

        socket.on("message", (msg, info) => {
            console.log("received message " + msg.toString());
        });

        const socketPromise = new Promise<AudioSocket>((resolve, reject) => {
            socket.on("listening", () => {
                const port = socket.address().port;
                resolve(new AudioSocket(socket, port));
            });
        });

        socket.bind(0);
        return socketPromise;
    }
}