import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportAProblemPageRoutingModule } from './report-aproblem-routing.module';

import { ReportAProblemPage } from './report-aproblem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportAProblemPageRoutingModule
  ],
  declarations: [ReportAProblemPage]
})
export class ReportAProblemPageModule { }
