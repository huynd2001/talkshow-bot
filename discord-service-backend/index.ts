import { config } from "dotenv";
import { Bot } from "./bot";
import { WebSocketServer } from "./socket";

config();

let socketPortal = process.env.WEBSOCKET_PORTAL;
let token = process.env.TOKEN;

new Bot(token as string)
    .listen_and_report(
        WebSocketServer.createWebSocket(parseInt(socketPortal as string)));

