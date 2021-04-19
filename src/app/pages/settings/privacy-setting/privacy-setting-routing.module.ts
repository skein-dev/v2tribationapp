import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacySettingPage } from './privacy-setting.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacySettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacySettingPageRoutingModule { }
