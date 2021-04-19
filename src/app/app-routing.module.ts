import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule),
  },
  {
    path: 'timeline',
    loadChildren: () => import('./pages/timeline/timeline.module').then(m => m.TimelinePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'teams',
    loadChildren: () => import('./pages/teams/teams.module').then(m => m.TeamsPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then(m => m.EventsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'friends-list',
    loadChildren: () => import('./pages/friends-list/friends-list.module').then(m => m.FriendsListPageModule)
  },
  {
    path: 'requests',
    loadChildren: () => import('./pages/requests/requests.module').then(m => m.RequestsPageModule)
  },
  {
    path: 'scouts',
    loadChildren: () => import('./pages/scouts/scouts.module').then(m => m.ScoutsPageModule)
  },
  {
    path: 'guardian',
    loadChildren: () => import('./pages/guardian/guardian.module').then(m => m.GuardianPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then(m => m.TermsPageModule)
  },
  {
    path: 'network-error',
    loadChildren: () => import('./pages/network-error/network-error.module').then( m => m.NetworkErrorPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'delete-account',
    loadChildren: () => import('./pages/delete-account/delete-account.module').then( m => m.DeleteAccountPageModule)
  },
  {
    path: 'about-tribation',
    loadChildren: () => import('./pages/settings/about-tribation/about-tribation.module').then( m => m.AboutTribationPageModule)
  },
  {
    path: 'discovery',
    loadChildren: () => import('./pages/discovery/discovery.module').then( m => m.DiscoveryPageModule)
  },
  {
    path: 'explore/:id',
    loadChildren: () => import('./pages/explore/explore.module').then( m => m.ExplorePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
