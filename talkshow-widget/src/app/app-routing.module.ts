import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscordChatComponent } from "./pages/discord-chat/discord-chat.component";

const routes: Routes = [
  { path : "/", component: DiscordChatComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
