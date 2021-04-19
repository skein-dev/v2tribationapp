import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  },
  {
    path: 'direct-chat/:id',
    loadChildren: () => import('./direct-chat/direct-chat.module').then(m => m.DirectChatPageModule)
  },
  {
    path: 'group-chat/:id',
    loadChildren: () => import('./group-chat/group-chat.module').then(m => m.GroupChatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule { }
