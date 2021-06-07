import {Channel, Client, GuildChannel} from "discord.js";
import {EventEmitter} from "events";
import Websocket, { Server } from "ws";

export class Bot {

    channel : Channel | undefined;
    listener : Array<Websocket> = [];

    constructor(token : string,
                private client = new Client()) {
        this.client
            .login(process.env.TOKEN)
            .then(r => console.log(`Log in successful as ${this.client?.user?.username}`))
            .catch(e => {
                console.log("Big Lmao");
                console.log(e);
            });
    }

    listen_and_report(wss: Server) : void {

        wss.on('connection', (ws) => {
            ws.on('open', () => {
                ws.send(JSON.stringify({
                    update: "channel",
                    object: this.channel
                }));
            });

            this.listener.push(ws);
        });

        this.client.on('ready', () => {
            // don't need to do anything lmao
        });

        this.client.on('message', msg => {

            if (msg.channel.type === 'dm') {
                return ;
            }

            if (!msg.author.bot
                && msg.guild?.member(msg.author)?.hasPermission("ADMINISTRATOR")
                && msg.cleanContent == "a!bind") {
                this.channel = msg.channel;
                this.listener.forEach((ws) => {
                    ws.send(JSON.stringify({
                        update: "channel",
                        object: this.channel as GuildChannel
                    }));
                });
                msg.react('👍').then(r => {
                    console.log(`Binding successful to ${(msg.channel as GuildChannel).name}`);
                });
                return ;
            }

            if (this.channel != undefined && msg.channel.equals(this.channel as GuildChannel)) {
                console.log(`${msg.guild?.member(msg.author)?.nickname}: ${msg.content}`);
                this.listener.forEach((ws) => {
                    ws.send(JSON.stringify({
                        update: "message",
                        object: msg
                    }));
                });
            }
            else {
                // Do nothing
            }

        });

    }

}