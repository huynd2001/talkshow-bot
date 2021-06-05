import {Injectable, Input} from '@angular/core';
import { Channel } from "discord.js";

@Injectable({
  providedIn: 'root'
})
export class DiscordMessService {

  BindingChannel : string = "";

  constructor() {
    require('dotenv').config();
    console.log(`Bot Token: ${process.env.TOKEN}`);
  }
}
