import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutTribationPage } from './about-tribation.page';

const routes: Routes = [
  {
    path: '',
    component: AboutTribationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutTribationPageRoutingModule { }
