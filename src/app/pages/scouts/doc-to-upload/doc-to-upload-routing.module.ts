import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocToUploadPage } from './doc-to-upload.page';

const routes: Routes = [
  {
    path: '',
    component: DocToUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocToUploadPageRoutingModule { }
