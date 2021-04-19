import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectChatPage } from './direct-chat.page';

const routes: Routes = [
  {
    path: '',
    component: DirectChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectChatPageRoutingModule { }
