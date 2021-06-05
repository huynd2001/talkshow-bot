import {Injectable, Input} from '@angular/core';
import {Channel, Client, DMChannel} from "discord.js";

@Injectable({
  providedIn: 'root'
})
export class DiscordMessService {

  client : Client | undefined;
  channel : Channel | undefined;

  constructor() {
    require('dotenv').config();
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
            if (!(msg.channel instanceof DMChannel)) {
              console.log(`Binding successful to ${msg.channel.name}`)
            }
            else {
              // should never happen
            }
          });
          return ;
      }


    });

    this.client
      .login(process.env.TOKEN)
      .then(r => console.log(`Log in successful as ${this.client?.user?.username}`));
  }

}
