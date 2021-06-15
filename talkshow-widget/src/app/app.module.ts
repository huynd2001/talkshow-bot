import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscordChatComponent } from './pages/discord-chat/discord-chat.component';
import { MessageComponent } from './pages/discord-chat/message/message.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ServerConstants } from 'src/assets/constants/server';

const config: SocketIoConfig = { url: ServerConstants.DISCORD_ENDPOINT, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DiscordChatComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
