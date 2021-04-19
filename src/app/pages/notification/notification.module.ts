import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationPageRoutingModule } from './notification-routing.module';

import { NotificationPage } from './notification.page';
import { BoldPipe } from '../../pipes/bold.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // BoldPipe,
    NotificationPageRoutingModule
  ],
  declarations: [NotificationPage, BoldPipe],
  // exports: [BoldPipe],

})
export class NotificationPageModule { }
