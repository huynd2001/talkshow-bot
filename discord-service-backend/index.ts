import { config } from "dotenv";
import { Bot } from "./discord-bot/bot";
import { SocketIOServer } from "./socket";

config();

let token = process.env.TOKEN;

new Bot(token as string)
    .listen_and_report(
        SocketIOServer.createWebSocket(8000));

