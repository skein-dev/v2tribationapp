import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, IonReorderGroup } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Calendar } from '@ionic-native/calendar/ngx';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GenralUtilsService } from './services/genral-utils.service';
import { EventsCustomService } from './services/events-custom.service';
import { CacheModule } from 'ionic-cache';
import { RecaptchaModule } from 'ng-recaptcha';

import { ViewTeamEventComponent } from './components/view-team-event/view-team-event.component';
import { AddTeamEventComponent } from './components/add-team-event/add-team-event.component';
import { AboutTeamComponent } from './components/about-team/about-team.component';
import { EditTeamEventComponent } from './components/edit-team-event/edit-team-event.component';
import { AddTeamMemberComponent } from './components/add-team-member/add-team-member.component';
import { ScoutToolFilterComponent } from './components/scout-tool-filter/scout-tool-filter.component';
import { SelectCountryComponent } from './components/select-country/select-country.component';
import { SelectSportsOrLagacyComponent } from './components/select-sports-or-lagacy/select-sports-or-lagacy.component';
import { SearchInAppComponent } from './components/search-in-app/search-in-app.component';
import { ProfilePortfolioComponent } from './components/profile-portfolio/profile-portfolio.component';
import { CreateGroupChatComponent } from './components/create-group-chat/create-group-chat.component';
import { AddGroupChatMembersComponent } from './components/add-group-chat-members/add-group-chat-members.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AddSectionComponent } from './components/profile-portfolio/add-section/add-section.component';
import { AboutGroupChatComponent } from './components/about-group-chat/about-group-chat.component';
import { PositionForSportsComponent } from './components/select-sports-or-lagacy/position-for-sports/position-for-sports.component';
import { CommentOnPostComponent } from './components/comment-on-post/comment-on-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { MultimediaViewComponent } from './components/multimedia-view/multimedia-view.component';
import { ScoutSubscribtionInfoComponent } from './components/scout-subscribtion-info/scout-subscribtion-info.component';
import {IntroLanguageComponent } from './components/intro-language/intro-language.component';
import { FilterSportDiscoveryComponent} from './components/filter-sport-discovery/filter-sport-discovery.component';

// import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';


// import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';

// import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireModule } from '@angular/fire';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
// API for socket connection
const socketConfig: SocketIoConfig = {
  url: 'https://tribation.com/', options: {}
};


// API for Firebase Notification
let fireConfig = {
  apiKey: 'AIzaSyBU5LCXy1KUc8fCS48VW_QHWN1EHfegqeo',
  authDomain: 'tribation-234415.firebaseapp.com',
  databaseURL: 'https://tribation-234415.firebaseio.com',
  projectId: 'tribation-234415',
  storageBucket: 'tribation-234415.appspot.com',
  messagingSenderId: '726234007471',
};

@NgModule({
  declarations: [
    AppComponent,
    ViewTeamEventComponent,
    AddTeamEventComponent,
    AboutTeamComponent,
    EditTeamEventComponent,
    AddTeamMemberComponent,
    ScoutToolFilterComponent,
    SelectCountryComponent,
    SelectSportsOrLagacyComponent,
    SearchInAppComponent,
    ProfilePortfolioComponent,
    CreateGroupChatComponent,
    AddGroupChatMembersComponent,
    AddSectionComponent,
    AboutGroupChatComponent,
    PositionForSportsComponent,
    CommentOnPostComponent,
    MultimediaViewComponent,
    EditPostComponent,
    ScoutSubscribtionInfoComponent,
    IntroLanguageComponent,
    FilterSportDiscoveryComponent
  ],
  entryComponents: [
    ViewTeamEventComponent,
    AddTeamEventComponent,
    AboutTeamComponent,
    EditTeamEventComponent,
    AddTeamMemberComponent,
    ScoutToolFilterComponent,
    SelectSportsOrLagacyComponent,
    SelectCountryComponent,
    SearchInAppComponent,
    ProfilePortfolioComponent,
    IonReorderGroup,
    AddGroupChatMembersComponent,
    CreateGroupChatComponent,
    AddSectionComponent,
    AboutGroupChatComponent,
    PositionForSportsComponent,
    MultimediaViewComponent,
    CommentOnPostComponent,
    EditPostComponent,
    ScoutSubscribtionInfoComponent,
    IntroLanguageComponent,
    FilterSportDiscoveryComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    CacheModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(socketConfig),
    RecaptchaModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    // AngularFireModule.initializeApp(fireConfig),
    // AngularFireAuthModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GenralUtilsService,
    InAppBrowser,
    EventsCustomService,
    AndroidPermissions,
    AppVersion,
    Network,
    Keyboard,
    Market,
    File,
    Calendar,
    MediaCapture,
    // StreamingMedia,
    Camera,
    VideoEditor,
    FilePath,
    InAppPurchase2,
    // SignInWithApple,
    GooglePlus,
    PayPal,
    // SignInWithApple,
    Badge,
    BackgroundMode
    // FirebaseAuthentication
  ],

  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
