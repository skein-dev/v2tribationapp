import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsListPageRoutingModule } from './friends-list-routing.module';

import { FriendsListPage } from './friends-list.page';
import { FriendsPipe } from 'src/app/pipes/friends.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsListPageRoutingModule,
  ],
  declarations: [FriendsListPage, FriendsPipe]
})
export class FriendsListPageModule { }
