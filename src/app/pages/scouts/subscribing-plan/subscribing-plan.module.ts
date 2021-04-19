import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscribingPlanPageRoutingModule } from './subscribing-plan-routing.module';

import { SubscribingPlanPage } from './subscribing-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscribingPlanPageRoutingModule
  ],
  declarations: [SubscribingPlanPage]
})
export class SubscribingPlanPageModule { }
