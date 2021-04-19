import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoutsPage } from './scouts.page';

const routes: Routes = [
  {
    path: '',
    component: ScoutsPage
  },
  {
    path: 'doc-to-upload',
    loadChildren: () => import('./doc-to-upload/doc-to-upload.module').then(m => m.DocToUploadPageModule)
  },
  {
    path: 'subscribing-plan',
    loadChildren: () => import('./subscribing-plan/subscribing-plan.module').then(m => m.SubscribingPlanPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoutsPageRoutingModule { }
