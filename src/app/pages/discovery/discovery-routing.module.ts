import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoveryPage } from './discovery.page';

const routes: Routes = [
  {
    path: '',
    component: DiscoveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoveryPageRoutingModule { }
