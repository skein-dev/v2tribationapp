import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'privacy-setting',
    loadChildren: () => import('./privacy-setting/privacy-setting.module').then(m => m.PrivacySettingPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./language/language.module').then(m => m.LanguagePageModule)
  },
  {
    path: 'notification-setting',
    loadChildren: () => import('./notification-setting/notification-setting.module').then(m => m.NotificationSettingPageModule)
  },
  {
    path: 'help-center',
    loadChildren: () => import('./help-center/help-center.module').then(m => m.HelpCenterPageModule)
  },
  {
    path: 'report-aproblem',
    loadChildren: () => import('./report-aproblem/report-aproblem.module').then(m => m.ReportAProblemPageModule)
  },
  {
    path: 'about-tribation',
    loadChildren: () => import('./about-tribation/about-tribation.module').then(m => m.AboutTribationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule { }
