import {CommandModel, CommandResult} from "./command-models";
import {DMChannel, Guild, GuildChannel, Message} from "discord.js";
import {Bot} from "../bot";

export class BindCommandBuilder {

    private static comms : CommandModel[] = new Array<CommandModel>(
        new CommandModel(
            "bind",
            (msg: Message, botContext: Bot) => {
                botContext.handle_binding(msg);
            },
            ["ADMINISTRATOR"],
            ["text"]

        ),
        new class GoodBotCommand extends CommandModel {
            protected verify(msg: Message, bot_context: Bot): CommandResult {
                let result =  super.verify(msg, bot_context);

                let processing = function (r: CommandResult, b: boolean, e: string) : void {
                    if(r.success && !b) r.error = e;
                    r.success = r.success &&  b;
                }

                processing(result, !(msg.channel instanceof DMChannel),
                            "Command is From DM Channel!");
                if(!result.success) return result;
                processing(result, (bot_context.getChannel() != undefined),
                            "There is no binding yet!");
                if(!result.success) return result;
                processing(result, (msg.channel as GuildChannel).equals(bot_context.getChannel() as GuildChannel),
                            "The commands is not from the binding channel!");
                return result;
            }
        }(
            "goodbot",
            (msg: Message, bot_contextBot) => {
                msg.channel.send("You're welcome ❤❤❤❤").then(r => {
                });
            },
            [],
            ["text"]
        )
    );

    public static getCommands() : CommandModel[] {

        return this.comms;
    }
}