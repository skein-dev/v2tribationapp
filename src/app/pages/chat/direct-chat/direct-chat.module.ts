import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectChatPageRoutingModule } from './direct-chat-routing.module';

import { DirectChatPage } from './direct-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectChatPageRoutingModule
  ],
  declarations: [DirectChatPage]
})
export class DirectChatPageModule { }
