import { Component } from '@angular/core';

import {
  Platform, ModalController, MenuController, LoadingController, AlertController, NavController, ToastController
} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Custom
import { environment } from '../environments/environment';
import { Socket } from 'ngx-socket-io';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Network } from '@ionic-native/network/ngx';
import { ApiService } from './services/api.service';
import { Market } from '@ionic-native/market/ngx';
import { GenralUtilsService } from './services/genral-utils.service';
import { EventsCustomService } from './services/events-custom.service';
import { SearchInAppComponent } from './components/search-in-app/search-in-app.component';
import { FcmServiceService } from './services/fcm-service.service';
import { Capacitor, Plugins } from '@capacitor/core';
import { Badge } from '@ionic-native/badge/ngx';
// import { Device } from '@ionic-native/device/ngx';
// import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';



const { Share } = Plugins;
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  route: any;
  // Basic User Details
  userDetail = null;
  profileImageURL = null;
  profileFirstname = null;
  profileLastName = null;
  profilePicUrl = '../assets/defaultProfile.png';
  url = 'https://bit.ly/2WXMO2d';
  usernameShare;
  head;
  gb;
  sendMessage;
  online = true;
  profileId = null;
  isScout = null;
  // loggedout = false;
  environment: any;
  postCount: any;
  requestCount: any;
  messageCount: any;
  notificationCount: any;
  needToUpdate: boolean;
  userStatus: any;
  isGuardian = false;
  isMinor = false;
  isMinorGuarded = false;
  storedLangFile;
  storedLangFlag;
  storedLang;

  // Strings
  shareString = 'Share you presence on Tribation';
  timelineString = 'timeline';
  searchString = 'search';
  teamString = 'teams';
  myprofileString = 'my profile';
  eventsString = 'events';
  helpcenterString = 'help center';
  logoutString = 'log out';
  doYouWantLogoutString = 'are you sure you want to logout?';
  exitString = 'Exit';
  exitMessageString = 'Are you sure you want to exit?';
  areYouSureString = 'logout';
  cancelString = 'cancel';
  yesString = 'yes';
  scoutsToolString = 'Scout Tool';
  guardianString = 'Guardian';
  updateMessageString = 'Please update your Tribation App to the latest version';
  updateString = 'Update';
  aboutTribationString = 'About Tribation'

  currentLocation;
  minorData;
  regularUser = false;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    // private device: Device,
    private backgroundMode: BackgroundMode,
    private modalcontrolller: ModalController,
    private menu: MenuController,
    private socket: Socket,
    private fcmService: FcmServiceService,
    private alertController: AlertController,
    private router: Router,
    private market: Market,
    private actRouter: ActivatedRoute,
    private network: Network,
    private location: Location,
    private badge: Badge,
    private eventCustom: EventsCustomService,
    // private backgroundMode: BackgroundMode,
    private apiService: ApiService,
    private utilServ: GenralUtilsService) {

    this.actRouter.queryParams.subscribe(() => {
      this.network.onDisconnect().subscribe((e: any) => {
        this.online = false;
        localStorage.setItem('online', 'false');
        this.router.navigate(['/network-error']);
        this.socket.emit('messageStatusUpdate', { status: 2, fromid: this.userDetail.id, update: 1  });
        this.socket.emit('grpmessageStatusUpdate', {fromid: this.userDetail.id, rcvall: true  });
      });
      this.network.onConnect().subscribe((e: any) => {

        this.online = true;
        localStorage.setItem('online', 'true');
        if (this.currentLocation === '/network-error') {
          this.location.back();
        }
      });
      this.postCount = 0;
      this.requestCount = 0;
      this.messageCount = 0;
      this.notificationCount = 0;
      SplashScreen.show({
        autoHide: false
      });
      localStorage.setItem('firstTime', 'true');
      this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
      this.utilServ.getMyMinors(this.userDetail.id);
      this.utilServ.getUserStatus(this.userDetail.id);
      // this.socket.on('guardian-accept-request', (data) => {
      //   if (data) {
      //     this.isGuardian = true;
      //   }
      // });
      this.eventCustom.subscribe('showGuardianTool', (dta) => {
        if (dta === true) {
          this.isGuardian = true;
        } else if (dta === false) {
          this.isGuardian = false;
          // console.log(localStorage.getItem('currentLocation'));
          if (localStorage.getItem('currentLocation') === '"/guardian"') {
            this.utilServ.navTimeline();
          }
        }
      });
      this.socket.emit('messageStatusUpdate', { status: 2, fromid: this.userDetail.id, update: 1  });
      this.socket.emit('grpmessageStatusUpdate', {fromid: this.userDetail.id, rcvall: true  });
    });

    setInterval(() => {
      if (this.userDetail) {
        this.socket.emit('login', { id: this.userDetail.tokenid });
      }
    }, 2200);

    setTimeout(() => {
      const init = setInterval(() => {
        if (this.profileFirstname && this.profileLastName) {
          clearInterval(init);
        } else {
          this.setupBasicDetails();
        }
      }, 400);
    }, 1500);

    // Timeline badge count
    this.socket.on('wallPost-event', (data) => {
      this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
      if (data.user.id !== this.userDetail.id) {
        this.postCount = this.postCount + 1;
      }
    });
    this.socket.on('refresh-session', () => {
      this.logMiorOut();
    });
    this.eventCustom.subscribe('wallpostRead', (readData) => {
      if (readData === 1) {
        this.postCount = 0;
      }
    });

    // Requests,chats,notification badge count
    this.eventCustom.subscribe('badgeCount', (data) => {
      this.apiService.getBadgeCriteria(this.userDetail.id).subscribe((res: any) => {
        if (res) {
          this.requestCount = res.message.requests;
          this.messageCount = res.message.chats;
          this.notificationCount = res.message.notifications;
          // this.eventCustom.destroy('badgeCount');
        }
      });
    });

    this.environment = environment;
    this.router.events.subscribe((val) => {
      this.currentLocation = this.router.routerState.snapshot.url;
      localStorage.setItem('currentLocation', JSON.stringify(this.router.routerState.snapshot.url));
      this.route = this.router.routerState.snapshot.url;
    });
    this.initializeApp();
    this.socket.on('guardian-accept-request', (res) => {
      if (this.isMinor) {
        this.logMiorOut();
      }
    });

    this.socket.on('guardian-cancel-link', (res) => {
      if (this.isMinor) {
        this.logMiorOut();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backgroundMode.enable();

      this.fcmService.registerPush();
      setTimeout(() => {
        this.checkVersion();
      }, 15000);
      this.statusBar.styleDefault();
      if (this.userDetail === null) {
        this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
        if (!this.utilServ.getIntroStatus()) {
          this.utilServ.languageSetup();
          this.utilServ.navIntro();
        }
        this.setupBasicDetails();
      }
      if (this.platform.is('android')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#000000');
      } else if (this.platform.is('ios' || 'iphone')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#ffffff');
      }
      const permis = JSON.parse(localStorage.getItem('notificationPermissions'));
      if (permis === false) {
        this.fcmService.newToken();
        this.eventCustom.subscribe('newDeviceTocken', (token: any) => {
          localStorage.setItem('devicetoken', JSON.stringify(token));
          this.fcmService.registerPushNativeReassign();
          this.fcmService.registerPush();
          this.apiService.registerToken(token, this.userDetail.email).subscribe((res: any) => {
            this.fcmService.registerPush();
            // console.log(res);
          });
        });
      }
    });
    this.platform.pause.subscribe(() => {// background
      this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
      // this.socket.emit('socketDisconnect', { id: this.userDetail.tokenid }, (e => {
        // console.log('This is soket disconnect', e);
      // }));
      localStorage.setItem('notificationPermissions', JSON.stringify(this.fcmService.getStatus()))
      this.socket.connect();

      // this.backgroundMode.on('activate').subscribe(() => {
      //   this.backgroundMode.disableWebViewOptimizations();
      //   this.backgroundMode.disableBatteryOptimizations();
      //   this.socket.connect();
      // });
      // this.backgroundMode.on('activate').subscribe(s => {
    
      // });
      // this.backgroundMode.enable();
    });

    this.platform.resume.subscribe(() => {// foreground
      // console.log('resume');
      // const xC = JSON.parse(localStorage.getItem('currentLocation'));
      // const x = this.router.routerState.snapshot.url;
      // // setTimeout(() => {
      // //   console.log('navigating to :', x);
      // //   this.router.navigate([x]);
      // // }, 50);
      // console.log('local: ', xC, ' ::Router: ', x);
      // console.log('current', this.currentLocation, ' rou: ', this.route);

      // if (x === '/signup' || x === '/timeline' || x === '/teams/create-team' || x === '/profile/:id') {
      //   console.log('Just Casual');
      //   setTimeout(() => {
      //     console.log('navigating to :', x);
      //     this.router.navigate([x]);
      //   }, 50);
      // } else
      if (this.userDetail === null) {
        this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
        this.setupBasicDetails();
      }
      const permis = JSON.parse(localStorage.getItem('notificationPermissions'));
      if (permis === false) {
        this.fcmService.newToken();
        this.eventCustom.subscribe('newDeviceTocken', (token: any) => {
          localStorage.setItem('devicetoken', JSON.stringify(token));
          this.fcmService.registerPushNativeReassign();
          this.fcmService.registerPush();
          this.apiService.registerToken(token, this.userDetail.email).subscribe((res: any) => {
            this.fcmService.registerPush();
            // console.log(res);
          });
        });

        this.apiService.getBadgeCriteria(this.userDetail.id).subscribe((res: any) => {
          if (res) {
            this.requestCount = res.message.requests;
            this.messageCount = res.message.chats;
            this.notificationCount = res.message.notifications;
            // this.eventCustom.destroy('badgeCount');
            }
          });
      }
        this.fcmService.readNotification();
    });

    this.socket.on('reloadApp', () => {
      this.utilServ.setUpUser();
      SplashScreen.show({
        autoHide: false
      });
      setTimeout(() => {
        this.utilServ.checkBasicElseRelodApp();
        SplashScreen.hide();
      }, 1000);
    });


    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      switch (JSON.parse(localStorage.getItem('currentLocation'))) {
        case '/timeline':
          {
            this.showExitConfirm();
            break;
          }
        case '/friends-list':
          {
            this.utilServ.navTimeline();
            break;
          }
        case '/requests':
          {
            this.utilServ.navTimeline();
            break;
          }
        case '/chat':
          {
            this.utilServ.navTimeline();
            break;
          }
        case '/notification':
          {
            this.utilServ.navTimeline();
            break;
          }
        case '/network-error': {
          this.showExitConfirm();
          break;
        }
        case '/scouts/doc-to-upload': {
          this.utilServ.navTimeline();
          break;
        }
        case '/login': {
          this.showExitConfirm();
          break;
        }
        case '/signup': {
          this.utilServ.navLogin();
          break;
        }
        default:
          this.location.back();
      }
      processNextHandler();
    });

    this.platform.backButton.subscribeWithPriority(5, () => {
      this.alertController.getTop().then(r => {
        if (r) {
          navigator['app'].exitApp();
        }
      }).catch(e => {
        console.log(e);
      });
    });
  }

  checkUser() {
    this.apiService.checkUserValidity(this.userDetail.id).subscribe((res: any) => {
      if (res.message === true) {
        // console.log('Valid');
      } else if (res.message === false) {
        // console.log('UnValid');
        this.menu.close();
        this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
        const tokenlog = JSON.parse(localStorage.getItem('userdetail'));
        this.apiService.logout(tokenlog.token).pipe().subscribe((res: any) => {
          localStorage.clear();
          this.utilServ.resetDefaults();
          this.resetDefaults();
          this.fcmService.deleteToken();
          localStorage.setItem('firstTime', 'true');
          this.utilServ.navLogin();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
      }
    });
  }

  setupBasicDetails() {
    localStorage.setItem('online', 'true');
    if (this.userDetail) {
      this.socket.emit('login', { id: this.userDetail.tokenid });
      const data = {
        userId: this.userDetail.id,
        email: this.userDetail.email
      };
      this.socket.emit('findUser', data);
      this.checkUser();
    }
    this.apiService.connectFuntion();
    this.utilServ.setUpUser();
    this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
    this.eventCustom.subscribe('userDetail', (e) => {
      // if (this.loggedout === true) {
      //   this.eventCustom.destroy('userDetail');
      //   setTimeout(() => {
      //     this.initializeApp();
      //   }, 450);
      // }
      if (this.userDetail !== null) {
        this.apiService.connectFuntion();
        this.profileId = e.id;
        this.profileImageURL = e.profile_img_url;
        this.profileFirstname = e.first_name;
        this.profileLastName = e.last_name;
        this.apiService.connectFuntion();
        if (this.utilServ.langLibrary) {
          this.shareString = this.utilServ.getLangByCode('share');
          this.guardianString = this.utilServ.getLangByCode('guardian_tool');
          this.scoutsToolString = this.utilServ.getLangByCode('scout_tool');
          this.searchString = this.utilServ.getLangByCode('search');
          this.teamString = this.utilServ.getLangByCode('team');
          this.myprofileString = this.utilServ.getLangByCode('myprofile');
          this.eventsString = this.utilServ.getLangByCode('events');
          this.helpcenterString = this.utilServ.getLangByCode('help');
          this.logoutString = this.utilServ.getLangByCode('logout');
          this.doYouWantLogoutString = this.utilServ.getLangByCode('do_you_want_logout');
          this.areYouSureString = this.utilServ.getLangByCode('are_you_sure');
          this.exitMessageString = this.utilServ.getLangByCode('exit_app_confirm');
          this.exitString = this.utilServ.getLangByCode('exit');
          this.cancelString = this.utilServ.getLangByCode('cancel');
          this.yesString = this.utilServ.getLangByCode('yes');                       // needTosee - yes is in english always
          this.timelineString = this.utilServ.getLangByCode('timeline');
          this.updateString = this.utilServ.getLangByCode('update');
          this.updateMessageString = this.utilServ.getLangByCode('common.label.versionDeprecatedWarning');
          this.aboutTribationString = this.utilServ.getLangByCode('about');
        }
        this.userStatus = JSON.parse(localStorage.getItem('userStatus'));
        this.apiService.getUserStatus(this.userDetail.id).subscribe((res: any) => {
          this.minorData = {
            minor: res.message.isMinor,
            guarded: res.message.isGuardedAthlete
          };
          if (this.minorData.minor === false) {
            this.regularUser = true;
          } else if (this.minorData.minor === true && this.minorData.guarded === false) {
            this.regularUser = false;
          } else if (this.minorData.minor === true && this.minorData.guarded === true) {
            this.regularUser = true;
          }
        });

        if (this.userDetail.email_status === 'verified' && this.userDetail.user_type === 'scout'
          && this.userDetail.scout_status === 'active') {
          this.isScout = true;
          this.utilServ.setScoutStatus(this.isScout);
        } else {
          this.isScout = false;
          this.utilServ.setScoutStatus(this.isScout);
        }
        if(this.userStatus){
        if (this.userStatus.isMinor === true) {
          this.isMinor = true;
          this.isMinorGuarded = this.userStatus.isGuardedAthlete;
        } else if (this.userStatus.isGuardian === true) {
          this.isGuardian = true;
        }
      }
        if (JSON.parse(localStorage.getItem('firstTime'))) {
          // console.log('FirstTimeLocal');
          this.utilServ.userAddonDetails();
          this.utilServ.setSportsList();
          this.utilServ.languageSetup();
          this.utilServ.getCountryList();
          this.utilServ.initSockets();
          localStorage.removeItem('firstTime');
        }

      }
    });
  }

  async sahreInvite() {
    this.usernameShare = (this.profileFirstname + ' ' + this.profileLastName);
    this.head = ('Join ' + this.usernameShare + ' at Tribation a free app for athletes getting noticed!\n');
    this.gb = ('\n For Global Access Link: ' + this.url);
    this.sendMessage = (this.head + '\n Downlod your app now \n\t Android: play.google.com/store/apps/details?id=com.tribation.sportapp \n\t iOS: apps.apple.com/ca/app/tribation/id1460175372 \n\t or Visit us at: www.tribation.com \n');
    let shareRet = await Share.share({
      title: this.head,
      text: this.sendMessage,
      url: this.url,
      dialogTitle: 'Share your presence on Tribation With friends and family'
    });
  }
  logMiorOut() {
    this.menu.close();
    // this.loggedout = true;
    this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
    this.socket.emit('socketDisconnect', { id: this.userDetail.tokenid });
    const lastLoginUser = JSON.parse(localStorage.getItem('lastLoginUser'));
    if (lastLoginUser.age > 18) {
      this.utilServ.getMyMinors(lastLoginUser.id);
    }
    const myMinor = JSON.parse(localStorage.getItem('myMinors'));
    const tokenlog = JSON.parse(localStorage.getItem('userdetail'));
    this.apiService.logout(tokenlog.token).subscribe((res: any) => {
      localStorage.clear();
      this.utilServ.resetDefaults();
      this.resetDefaults();
      this.fcmService.deleteToken();
      this.utilServ.setIntroStatus(1);
      localStorage.setItem('firstTime', 'true');
      localStorage.removeItem('userStatus');
      // console.log('id:::::::', id);
      localStorage.setItem('lastLoginUser', JSON.stringify(lastLoginUser));
      localStorage.setItem('myMinors', JSON.stringify(myMinor));
      this.utilServ.navLogin();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  }
  async logout() {
    this.eventCustom.destroy('userDetail');
    const alert = await this.alertController.create({
      header: this.areYouSureString,
      message: this.doYouWantLogoutString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.menu.close();
          }
        }, {
          text: this.yesString,
          handler: () => {
            this.menu.close();
            // this.loggedout = true;
            this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
            this.storedLangFile =  localStorage.getItem('languageSetup');
            this.storedLangFlag =  JSON.parse(localStorage.getItem('langSetupFLag'));
            this.storedLang =  localStorage.getItem('profileLang') || 'english';
            this.socket.emit('socketDisconnect', { id: this.userDetail.tokenid });
            const lastLoginUser = JSON.parse(localStorage.getItem('lastLoginUser'));
            if (lastLoginUser.age > 18) {
              this.utilServ.getMyMinors(lastLoginUser.id);
            }
            const myMinor = JSON.parse(localStorage.getItem('myMinors'));
            const tokenlog = JSON.parse(localStorage.getItem('userdetail'));
            this.apiService.logout(tokenlog.token).subscribe((res: any) => {
              alert.dismiss();
              localStorage.clear();
              this.utilServ.resetDefaults();
              this.resetDefaults();
              this.fcmService.deleteToken();
              this.utilServ.setIntroStatus(1);
              localStorage.setItem('firstTime', 'true');
              localStorage.setItem('languageSetup', this.storedLangFile);
              localStorage.setItem('langSetupFLag', this.storedLangFlag);
              localStorage.setItem('profileLang', this.storedLang);
              localStorage.removeItem('userStatus');
              // console.log('id:::::::', id);
              localStorage.setItem('lastLoginUser', JSON.stringify(lastLoginUser));
              localStorage.setItem('myMinors', JSON.stringify(myMinor));
              this.utilServ.navLogin();
              setTimeout(() => {
                window.location.reload();
              }, 300);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async searchFun() {
    const modal = await this.modalcontrolller.create({
      component: SearchInAppComponent,
      componentProps: {
        // custom_id: this.shareValue
        swipeToClose: true
      }
    });
    return await modal.present();
  }

  myProfile() {
    this.router.navigate([`/profile/${this.profileId}`]);
  }

  resetDefaults() {
    this.userDetail = null;
    this.profileImageURL = null;
    this.profileFirstname = null;
    this.profileLastName = null;
    this.profileId = null;
    this.isScout = null;
    this.profilePicUrl = '../assets/defaultProfile.png';
    this.setupBasicDetails();
    // this.initializeApp();
  }

  async showExitConfirm() {
    const alertExit = await this.alertController.create({
      header: this.exitString + '?',
      message: this.exitMessageString,
      backdropDismiss: false,
      buttons: [{
        text: this.cancelString,
        role: 'cancel',
        handler: () => {
          // console.log('Application exit prevented!');
        }
      }, {
        text: this.exitString,
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });
    await alertExit.present();

  }

  async checkVersion() {
    // console.log('App CKeck');
    if (Capacitor.platform !== 'web') {
      this.utilServ.initVersioningCheck();
      this.eventCustom.subscribe('versionCheck', (data: any) => {
        if (data !== null) {
          this.needToUpdate = data;
          if (data === true) {
            this.needToUpdate = true;
            setTimeout(() => {
              this.menu.close();
              this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
              const tokenlog = JSON.parse(localStorage.getItem('userdetail'));
              this.apiService.logout(tokenlog.token).pipe().subscribe((res: any) => {
                localStorage.clear();
                this.utilServ.resetDefaults();
                this.resetDefaults();
                this.fcmService.deleteToken();
                localStorage.setItem('firstTime', 'true');
                this.utilServ.navLogin();
              });
            }, 550);
            this.eventCustom.destroy('versionCheck');
            // console.log('Need To Update');
          } else if (data === false) {
            this.needToUpdate = false;
            this.eventCustom.destroy('versionCheck');
            // console.log('You are good');
          }
        }
      });

    } else {
      this.needToUpdate = false;
      // console.log('Ya its a web');
    }
  }

  updateApp() {
    this.market.open('com.tribation.sportapp');
    // if (this.platform.is('android')) {
    //   window.open('play.google.com/store/apps/details?id=com.tribation.sportapp', '_system');
    // } else if (this.platform.is('ios' || 'iphone')) {
    //   window.open('apps.apple.com/ca/app/tribation/id1460175372', '_system');
    // }
  }
}
