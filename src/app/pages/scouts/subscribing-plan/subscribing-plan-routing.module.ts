import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscribingPlanPage } from './subscribing-plan.page';

const routes: Routes = [
  {
    path: '',
    component: SubscribingPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscribingPlanPageRoutingModule { }
