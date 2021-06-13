import { Channel, Client, Guild, GuildChannel, Message } from "discord.js";
import Websocket, { Server } from "ws";
import { MessageParsing } from "./message";
import {MessageFormat} from "../models/models";

export class Bot {

    channel : Channel | undefined;
    listener : Array<Websocket> = [];

    constructor(token : string,
                private client = new Client()) {
        this.client
            .login(token)
            .then(r => console.log(`Log in successful as ${this.client?.user?.username}`))
            .catch(e => {
                console.log("Big Lmao");
                console.log(e);
            });
    }

    public handle_incoming_message() : void {

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
                        response_obj: (this.channel as GuildChannel).name
                    }));
                });
                msg.react('👍').then(r => {
                    console.log(`Binding successful to ${(msg.channel as GuildChannel).name}`);
                });
                return ;
            }

            if (this.channel != undefined && msg.channel.equals(this.channel as GuildChannel)) {
                console.log(`${msg.author.username}: ${msg.content}`);
                if(msg.cleanContent == "a!goodbot") {
                    msg.channel.send(`You're welcome!!! <3`).then(r => {});
                }

                let res_obj : MessageFormat | undefined = MessageParsing.getMessageObject(msg);

                this.listener.forEach((ws) => {
                    ws.send(JSON.stringify({
                        update: "message",
                        response_obj: res_obj
                    }));
                });
            }
            else {
                // do nothing
            }
        });

    }

    public handle_message_edit() : void {

    }

    public handle_message_delete() : void {

    }

    listen_and_report(wss: Server) : void {

        wss.on('connection', (ws) => {

            console.log(`Connection from ${ws.url}`);

            if(this.channel) {
                ws.send(JSON.stringify({
                    update: "channel",
                    response_obj: (this.channel as GuildChannel).name
                }));
            }


            this.listener.push(ws);
        });

        this.client.on('ready', () => {
            // don't need to do anything lmao
        });

        this.handle_incoming_message()

    }

}