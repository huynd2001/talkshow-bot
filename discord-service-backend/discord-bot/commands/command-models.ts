import {Message, PermissionResolvable} from "discord.js";
import {Bot} from "../bot";
import {Client} from "discord.js";

export interface CommandResult {
    comm: string;
    author : string;
    error? : string;
    success: boolean;
}

export class CommandModel {

    constructor(public command : string,
                public handler : (msg: Message, bot_context: Bot) => void,
                public permissions: PermissionResolvable[],
                public allowedType: string[]){};

    protected verify(msg: Message, bot_context: Bot) : CommandResult {
        let member = msg.member;
        let channel = msg.channel;

        let result : CommandResult = {
            comm: this.command,
            author: msg.author.username,
            success: false
        }

        if(!this.permissions.every((perm) => member?.hasPermission(perm))) {
            result.error = "Not enough Permissions!";
            return result;
        }

        if(!this.allowedType.some((channelType) => channel.type == channelType)) {
            result.error = "The message is not from the allowed channel!";
            return result;
        }

        result.success = true;
        return result;
    }

    protected static logging(result: CommandResult) : void {
        if(result.success)
            console.log(`Command ${result.comm} received from ${result.author}!`);
        else
            console.log(result.error);
    }

    public run(msg: Message, bot_context: Bot) : void {

        let result = this.verify(msg, bot_context);

        if(result.success)
            this.handler(msg, bot_context);

        CommandModel.logging(result);

    }
}

export class CommandRunner {

    constructor(private commands: CommandModel[], private commandHeader: string) {}

    public initialize(botContext: Bot) : void {
        botContext.getClient().on('message', (msg) => {
            if (msg.cleanContent.startsWith(this.commandHeader)) {
                this.commands.find((comm : CommandModel) => {
                    return msg.cleanContent.split(' ')[0] == this.commandHeader + comm.command;
                })?.run(msg, botContext);
            }
        });
    }
}