import {Channel, Client, GuildChannel} from "discord.js"
import {config} from "dotenv";
import EventEmitter from "events";

const hmmm = "world";

config();

console.log(`Hello ${hmmm}! `);

class Bot {

    client : Client | undefined;
    channel : Channel | undefined;
    discordEmitter : EventEmitter = new EventEmitter();

    listen() : void {
        this.client = new Client();

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
                msg.react('U+1F44D').then(r => {
                    console.log(`Binding successful to ${(msg.channel as GuildChannel).name}`);
                    this.discordEmitter.emit('channel', msg.channel as GuildChannel);
                });
                return ;
            }

            if (this.channel != undefined && msg.channel.equals(this.channel as GuildChannel)) {
                this.discordEmitter.emit('message', msg);
            }
            else {
                // Do nothing
            }

        });

        this.client
            .login(process.env.TOKEN)
            .then(r => console.log(`Log in successful as ${this.client?.user?.username}`));

    }


}

new Bot().listen();

