import {Server} from "ws";

export class WebSocketServer {

    static createWebSocket(portal : number) : Server {

        let server = new Server({
            port: portal
        });

        console.log(`Create Websocket Server at ${server.address().toString()}`);
        return server;

    }

}

