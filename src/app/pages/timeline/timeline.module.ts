import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimelinePageRoutingModule } from './timeline-routing.module';

import { TimelinePage } from './timeline.page';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
// import { MentionModule } from 'angular-mentions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimelinePageRoutingModule,
    // MatButtonModule,
    // MatMenuModule,
    // MatMenu,
    // MatToolbarModule,
    // MatIconModule,
    // MatCardModule,
    // MentionModule,
  ],

  declarations: [TimelinePage],
  exports: [
    // MatButtonModule,
    // MatMenuModule,
    // MatMenu,
    // MatToolbarModule,
    // MatIconModule,
    // MatCardModule
  ]
})
export class TimelinePageModule { }
