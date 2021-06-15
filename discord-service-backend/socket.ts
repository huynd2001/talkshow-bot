// import {Server} from "ws";
import {Server} from "socket.io"
import {createServer} from "http";

export class SocketIOServer {

    static createWebSocket(portal : number) : Server {

        const httpServer = createServer();
        const server = new Server(httpServer, {
            cors: {origin: "http://localhost:4200"}
        });

        console.log(`Create Websocket Server at ${server}`);
        
        httpServer.listen(portal);
        
        return server;

    }

}
