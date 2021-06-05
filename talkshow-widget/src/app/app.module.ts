import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiscordChatComponent } from './pages/discord-chat/discord-chat.component';
import { MessageComponent } from './pages/discord-chat/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    DiscordChatComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
