import {Guild, GuildEmoji, Message, User} from "discord.js";

let emojiRegex = /<:[\w\d_]{2,}:\d+>/g;
let animatedRegex = /<a:[\w\d_]{2,}:\d+>/g
let mentionRegex = /(?<=<@!)(?=>)\d+/
let roleRegex = /(?<=<@&)(?=>)\d+/

export class MessageParsing {

    private static getUserColor(guild: Guild, user: User) : string {
        return '#FFFFFF';
    }

    public static parsing(guild: Guild, msg: Message) : string {
        let content = msg.cleanContent;
        content = content.replace(emojiRegex, (match : string) => {
            let id = match.match(/\d+/);
            let identifier = match.match(/:[\w\d_]{2,}:/);
            if(!id || id.length == 0 || !identifier || identifier.length == 0) return match;

            return `<img src='https://cdn.discordapp.com/emojis/${id[0]}.png' alt='${identifier[0]}'
                        width="14px" height="14px"/>`;
        });

        content = content.replace(animatedRegex, (match : string) => {
            let id = match.match(/\d+/);
            let identifier = match.match(/:[\w\d_]{2,}:/);
            if(!id || id.length == 0 || !identifier || identifier.length == 0) return match;

            return `<img src='https://cdn.discordapp.com/emojis/${id[0]}.gif' alt='${identifier[0]}'
                        width="14px" height="14px"/>`;
        });
        return content;
    }
}