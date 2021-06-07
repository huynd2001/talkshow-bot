import WebSocket, {Server} from "ws";

export class WebSocketServer {

    static createWebSocket(portal : number) : Server {

        return new Server({
            port: portal
        });

    }

}

