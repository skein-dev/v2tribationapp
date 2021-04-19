import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocToUploadPageRoutingModule } from './doc-to-upload-routing.module';

import { DocToUploadPage } from './doc-to-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocToUploadPageRoutingModule
  ],
  declarations: [DocToUploadPage]
})
export class DocToUploadPageModule { }
