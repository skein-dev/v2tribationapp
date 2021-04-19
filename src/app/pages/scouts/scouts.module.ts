import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoutsPageRoutingModule } from './scouts-routing.module';

import { ScoutsPage } from './scouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoutsPageRoutingModule
  ],

  declarations: [ScoutsPage]
})
export class ScoutsPageModule { }
