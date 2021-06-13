import {Guild, Message, User} from "discord.js";
import {Author, MessageFormat, MessagePart} from "../models/models";

const emojiRegex = /(<:[\w\d_]{2,}:\d+>)/g;
const animatedRegex = /(<a:[\w\d_]{2,}:\d+>)/g;
const mentionRegex = /(<@!\d+>)/g;
const roleRegex = /(<@&\d+>)/g;

const ultimateRegex = /(<:[\w\d_]{2,}:\d+>|<a:[\w\d_]{2,}:\d+>|<@!\d+>|<@&\d+>|@everyone|@here)/g;

interface RegExpHandler {
    reg: RegExp,
    handler: (msg: Message, match : string) => MessagePart;
}

const getID = (match : string) : Array<string | undefined> => {
    let id = match.match(/\d+/g);

    let identifier = match.match(/:[\w\d_]{2,}:/g);

    let arr = [];

    if(!id)
        arr.push(undefined);
    else
        arr.push(id[id.length - 1]);

    if(!identifier)
        arr.push(undefined);
    else
        arr.push(identifier[0]);

    return arr;

}

const regHandlerArray : Array<RegExpHandler> = [
    {
        reg: emojiRegex,
        handler: (msg: Message, match : string) => {

            let id = getID(match);

            return (id[0]) ? {
                cleanContent: "",
                emoji: {
                    id: `https://cdn.discordapp.com/emojis/${id[0]}.png`,
                    alt: `:${id[1]}:`
                }, attachment : MessageParsing.getAttachmentObject(msg)
            }    : {cleanContent: match, attachment : MessageParsing.getAttachmentObject(msg)};

        }
    },
    {
        reg: animatedRegex,
        handler: (msg: Message, match : string) => {

            let id = getID(match);

            return (id[0]) ? {
                cleanContent: "",
                emoji: {
                    id: `https://cdn.discordapp.com/emojis/${id[0]}.gif?v=1`,
                    alt: `:${id[1]}:`
                }, attachment : MessageParsing.getAttachmentObject(msg)
            } : {cleanContent: match, attachment : MessageParsing.getAttachmentObject(msg)};

        }
    },
    {
        reg: mentionRegex,
        handler: (msg: Message, match : string) => {

            let id = getID(match);

            let user = msg.client.users.resolve(id[0] ?? "");
            let member = (user) ? (msg.guild as Guild).member(user) : null;
            let name = (member?.nickname) ? member.nickname : user?.username;

            return (name)
                ? {
                    cleanContent : name,
                    format: {
                        color: MessageParsing.getUserColor(msg.guild as Guild, user as User)
                    }, attachment : MessageParsing.getAttachmentObject(msg)
                }
                : {cleanContent: match, attachment : MessageParsing.getAttachmentObject(msg)};

        }
    },
    {
        reg: roleRegex,
        handler: (msg: Message, match : string) => {

            let id = getID(match);

            let role = msg.guild?.roles.resolve(id[0] ?? "");

            return (role) ? {
                    cleanContent : role?.name,
                    format: {
                        color: role?.hexColor
                    }, attachment : MessageParsing.getAttachmentObject(msg)
                } : {cleanContent: match, attachment : MessageParsing.getAttachmentObject(msg)} ;
        }
    },
    {
        reg: /(@everyone)|(@here)/g,
        handler: (msg: Message, match : string) => {

            return {
                cleanContent: match,

                format: {
                    color: '#ffffff'
                },
                attachment : MessageParsing.getAttachmentObject(msg)

            } ;
        }
    }
]

export class MessageParsing {
    
    public static getUserColor(guild: Guild, user: User) : string {

        let member = guild.member(user);
        return member?.displayHexColor ?? '#ffffff';

    }

    public static getAuthorObject(guild: Guild, user: User) : Author {

        let member = guild.member(user);
        let name = ``;
        let isAdmin = false, isBot = false;
        
        if(member) {
            name = (member.nickname) ? member.nickname : user.username;

            isBot = member.user.bot;
            
            isAdmin = member.hasPermission("ADMINISTRATOR");

        }
        else {
            name = user.username;
        }

        let color = this.getUserColor(guild, user);
        return {
            author: name,
            color: color,
            isBot: isBot,
            isAdmin: isAdmin
        };
    }

    public static getMessageObject(msg: Message) : MessageFormat | undefined {
        try {
            return {
                id: msg.id,
                author: this.getAuthorObject(msg.guild as Guild, msg.author),
                content: MessageParsing.parsing(msg)
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    public static getAttachmentObject(msg : Message) : Array<string> {
        let atts = msg.attachments;
        return atts.map((att) => {
            return att.name ?? "???";
        });
    }

    public static parsing(msg: Message) : Array<MessagePart> {

        let content = msg.content;
        let arrString = content.split(ultimateRegex);
        return arrString.map((str) : MessagePart => {

            return regHandlerArray.find(handler => handler.reg.test(str))?.handler(msg, str)
                ?? {cleanContent : str, attachment : this.getAttachmentObject(msg)};

        });

    }
}