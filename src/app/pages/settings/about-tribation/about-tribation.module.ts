import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutTribationPageRoutingModule } from './about-tribation-routing.module';

import { AboutTribationPage } from './about-tribation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutTribationPageRoutingModule
  ],
  declarations: [AboutTribationPage]
})
export class AboutTribationPageModule { }
