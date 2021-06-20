import {Channel, Client, Guild, GuildChannel, Message, PartialMessage} from "discord.js";
import { Server } from "socket.io";
import { MessageParsing } from "./message";
import {MessageFormat} from "../models/models";
import {BindCommandBuilder} from "./commands/bind";
import {CommandRunner} from "./commands/command-models";

const timeOut = 60000;

export class Bot {

    private channel : Channel | undefined;
    private emitter : Server | undefined;

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

    public getClient() {
        return this.client;
    }

    public getChannel() {
        return this.channel;
    }

    private emitEvent(obj : {update : string, 
        response_obj: string | MessageFormat | undefined}) {
            if(this.emitter) 
                this.emitter.emit('discord', obj);
    }

    public handle_binding(msg: Message) : void {
        this.channel = msg.channel;

        this.emitEvent({
            update: "channel",
            response_obj: (this.channel as GuildChannel).name
        });

        msg.react('👍').then(r => {
            console.log(`Binding successful to ${(msg.channel as GuildChannel).name}`);
        });

        return ;
    }

    public handle_incoming_message() : void {

        this.client.on('message', msg => {

            if (msg.channel.type === 'dm') {
                return ;
            }

            if (this.channel != undefined && msg.channel.equals(this.channel as GuildChannel)) {
                console.log(`${msg.author.username}: ${msg.content}`);

                let res_obj : MessageFormat | undefined = MessageParsing.getMessageObject(msg);

                this.emitEvent({
                    update: "message",
                    response_obj: res_obj
                });
            }
            else {
                // do nothing
            }
        });

    }

    private handle_message_edit() : void {
        this.client.on('messageUpdate', async (oldMessage, newMessage) => {

            let newMessForm: MessageFormat | undefined;

            if (newMessage.partial) {
                newMessage = await newMessage.fetch();
            }

            if (oldMessage.partial) {
                oldMessage = await oldMessage.fetch();
            }

            if(oldMessage.channel.type == "dm")
                return ;

            if (this.channel != undefined
                && oldMessage.channel.equals(this.channel as GuildChannel)
                && Date.now().valueOf() - oldMessage.createdAt.valueOf() <= timeOut) {

                console.log(`${oldMessage.author.username} (edit): ${oldMessage.content} -> ${newMessage.content}`)

                newMessForm = MessageParsing.getMessageObject(newMessage);

                if (newMessForm) this.emitEvent({
                    update: "edit",
                    response_obj: newMessForm
                });
            }
        })
    }

    private async delete_message_event(message: Message | PartialMessage) {
        if (message.partial) {
            message = await message.fetch()
        }

        if(message.channel.type == "dm") return ;
        if (this.channel != undefined
            && message.channel.equals(this.channel as GuildChannel)
            && Date.now().valueOf() - message.createdAt.valueOf() <= timeOut) {
            console.log(`Delete message from ${message.author.username}`);
            this.emitEvent({
                update: 'delete',
                response_obj: message.id
            })
        }
    }

    private handle_message_delete() : void {

        this.client.on('messageDelete', async (message) => {
            await this.delete_message_event(message)
        });

        this.client.on('messageDeleteBulk', (messages) => {
            messages.forEach((msg) => this.delete_message_event(msg));
        });
    }

    private handle_commands() : void {
        
        let commands = BindCommandBuilder.commands;

        new CommandRunner(commands, "a!").initialize(this);

    }

    public listen_and_report(wss: Server) : void {

        this.emitter = wss;

        this.emitter.on('connection', (socket) => {

            console.log(`Connection from ${socket}`);

            this.emitter?.emit('connect-discord');

            if(this.channel) {
                this.emitEvent({
                    update: "channel",
                    response_obj: (this.channel as GuildChannel).name
                });
            }
        });

        this.client.on('ready', () => {
            // don't need to do anything lmao
        });

        this.handle_incoming_message();
        this.handle_message_edit();
        this.handle_message_delete();
        this.handle_commands();

    }

}