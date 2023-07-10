import {createSocket, Socket} from "dgram";
import sodium from 'libsodium-wrappers';

export class AudioSocket {
    socket: Socket;
    port: number;
    serverPort: number
    secret: Uint8Array

    constructor(socket: Socket, port: number, serverPort: number, secret: Uint8Array) {
        this.socket = socket
        this.port = port
        this.serverPort = serverPort
        this.secret = secret
    }

    static async create(serverPort: number, secret: Uint8Array): Promise<AudioSocket> {
        const socket = createSocket("udp4");

        const socketPromise = new Promise<AudioSocket>((resolve, reject) => {
            socket.on("listening", () => {
                const port = socket.address().port;
                resolve(new AudioSocket(socket, port, serverPort, secret));
            });
        });

        socket.bind(0);
        return socketPromise;
    }

    send(encryptedAudio: Uint8Array, nonce: Buffer, secret: Uint8Array) {
        const serverIp = IP_TO_SERVER ---> You find this in the #api-updates channel

        //const decryptedAudio = sodium.crypto_secretbox_open_easy(discordEncryptedAudio, nonce, secret)
        //const encryptedAudio = sodium.crypto_secretbox_easy(decryptedAudio, nonce, this.secret)
        const buffer = Buffer.concat([nonce, encryptedAudio]);
        this.socket.send(buffer, 0, buffer.length, this.serverPort, serverIp, (error) => {
            if (error !== null) throw error
        })
    }

    async onPacket(callback: (decryptedAudio: Uint8Array) => void) {
        this.socket.on("message", (msg, info) => {
            const nonce = new Uint8Array(msg.slice(0, 24))
            const encryptedAudio = new Uint8Array(msg.slice(24))
            const decryptedAudio = sodium.crypto_secretbox_open_easy(encryptedAudio, nonce, this.secret)
            callback(decryptedAudio)
        })
    }
}