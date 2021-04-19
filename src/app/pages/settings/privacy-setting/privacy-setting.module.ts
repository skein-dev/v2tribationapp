import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacySettingPageRoutingModule } from './privacy-setting-routing.module';

import { PrivacySettingPage } from './privacy-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacySettingPageRoutingModule
  ],
  declarations: [PrivacySettingPage]
})
export class PrivacySettingPageModule { }
