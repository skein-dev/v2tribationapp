import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationSettingPageRoutingModule } from './notification-setting-routing.module';

import { NotificationSettingPage } from './notification-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationSettingPageRoutingModule
  ],
  declarations: [NotificationSettingPage]
})
export class NotificationSettingPageModule { }
