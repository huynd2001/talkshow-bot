import {Guild, GuildEmoji, Message, User} from "discord.js";

let emojiRegex = /<:[\w\d_]{2,}:\d+>/g;
let animatedRegex = /<a:[\w\d_]{2,}:\d+>/g
let mentionRegex = /<@!\d+>/g;
let roleRegex = /<@&\d+>/g;

export class MessageParsing {

    private static getUserColor(guild: Guild, user: User) : string {
        let member = guild.member(user);

        return member?.displayHexColor ?? '#ffffff';
    }

    public static getAuthorString(guild: Guild, user: User) : string {
        let member = guild.member(user);
        let name = ``;
        let icons = ``;
        if(member) {
            name = (member.nickname) ? member.nickname : user.username;
            if(member.user.bot) {
                icons = `<i class="bi bi-gear"></i>`;
            }
            else if(member.hasPermission("ADMINISTRATOR")) {
                icons = `<i class="bi bi-person-badge"></i>`;
            }
        }
        else {
            name = user.username;
        }
        let color = this.getUserColor(guild, user);
        return `${icons} <b><font color="${color}">${name}</font></b>`;
    }

    public static parsing(msg: Message) : string {
        let content = msg.content;
        content = content.replace(emojiRegex, (match : string) => {
            let id = match.match(/\d+/);
            let identifier = match.match(/:[\w\d_]{2,}:/);
            if(!id || id.length == 0 || !identifier || identifier.length == 0) return match;

            return `<img src='https://cdn.discordapp.com/emojis/${id[0]}.png' alt='${identifier[0]}'
                        width="16px" height="16px"/>`;
        });

        content = content.replace(animatedRegex, (match : string) => {
            let id = match.match(/\d+/);
            let identifier = match.match(/:[\w\d_]{2,}:/);
            if(!id || id.length == 0 || !identifier || identifier.length == 0) return match;

            return `<img src='https://cdn.discordapp.com/emojis/${id[0]}.gif?v=1' alt='${identifier[0]}'
                        width="16px" height="16px"/>`;
        });

        content = content.replace(/@everyone/g, `<b>@everyone</b>`);
        content = content.replace(/@here/g, `<b>@here</b>`);

        content = content.replace(mentionRegex, (match: string) => {
            let ids = match.match(/\d+/);
            if(!ids || ids.length == 0) return match;
            let user = msg.client.users.resolve(ids[0]);
            let member = (user) ? (msg.guild as Guild).member(user) : null;
            let name = (member?.nickname) ? member.nickname : user?.username;

            return (name)
                ? `<b><font color="${this.getUserColor(msg.guild as Guild, user as User)}">@${name}</font></b>`
                : match;
        })

        content = content.replace(roleRegex, (match: string) => {
            let ids = match.match(/\d+/);
            if(!ids || ids.length == 0) return match;
            let id = ids[0];
            let role = msg.guild?.roles.resolve(id);

            return (role)
                ? `<b><font color="${role.hexColor}">@${role.name}</font></b>`
                : match;

        })

        return content;
    }
}