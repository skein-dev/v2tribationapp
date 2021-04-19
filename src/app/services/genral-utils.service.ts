import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, NavController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, JsonPipe } from '@angular/common';
// import { Globalization } from '@ionic-native/globalization/ngx';
// import { Device } from '@ionic-native/device/ngx';
import { ApiService } from './api.service';
import { EventsCustomService } from './events-custom.service';
import * as deepEqual from 'deep-equal';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { Capacitor, Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class GenralUtilsService {
  loaderToShow: Promise<void>;
  languageData;
  langLibrary = null;
  langSetupFLag = false;
  loderUp = false;
  introStatus: number;
  userDetail: any = null;
  friendsList = null;
  favSports = [];
  scoutStatus = false;
  guardiaSatus = false;
  teamData: any = null;
  sportsList: any;
  countryList: any;

  constructor(
    private network: Network,
    private toast: ToastController,
    // private globalization: Globalization,
    private socketAPI: Socket,
    private loadingController: LoadingController,
    private platform: Platform,
    private appVersion: AppVersion,
    private alertController: AlertController,
    private toastController: ToastController,
    private location: Location,
    private router: Router,
    private keyboard: Keyboard,
    private eventCustom: EventsCustomService,
    private navCtrl: NavController,
    private apiService: ApiService,
    private actRouter: ActivatedRoute) {
    this.apiService.connectFuntion();
    this.actRouter.queryParams.subscribe(() => {
      // if (this.userDetail === null) {
      //   this.setUpUser();
      // } else {
      this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
      //   }
      const initFriend = setInterval(() => {
        this.userAddonDetails();
        if (this.friendsList) {
          clearInterval(initFriend);
        }
      }, 500);

      //   setTimeout(() => {
      //     const xDx = JSON.parse(localStorage.getItem('currentLocation'));
      //     const x = JSON.parse(localStorage.getItem('online'));
      //     if (xDx === '/login' && this.userDetail !== null && x === true) {
      //       setTimeout(() => {
      //         console.log('Smart Routeing');
      //         this.navTimeline();
      //       }, 800);
      //     } else {
      //       console.log('IF somthing Breaking Open Me and Fix');
      //     }
      //   }, 20);
    });
    this.setUpUser();
  }
  resetDefaults() {
    let xDx;
    this.languageData = null;
    this.langLibrary = null;
    this.langSetupFLag = false;
    this.userDetail = null;
    this.friendsList = null;
    this.favSports = [];
    this.scoutStatus = false;
    this.guardiaSatus = false;
    this.teamData = null;
    this.sportsList = null;
    this.countryList = null;
    setTimeout(() => {
      xDx = JSON.parse(localStorage.getItem('currentLocation'));
      if (xDx === '') {
        this.navLogin();
      }
      if (xDx !== '/login') {
        this.setUpUser();
      }
    }, 250);
  }
  checkUserExists() {
    if (!this.userDetail || this.userDetail === null) {
      this.navLogin();
    } else {
      // console.log('hi log CheckUsre');
    }
  }

  checkAlredyLoggedIn() {
    const x = JSON.parse(localStorage.getItem('userdetail'));
    // if (x) {
    if (this.userDetail != null) {
      return true;
    } else {
      return false;
    }
  }


  navLogin() {
    this.router.navigate(['/login']);
  }
  navSignup() {
    this.router.navigate(['/signup']);
  }
  navTimeline() {
    this.setUpUser();
    this.apiService.connectFuntion();
    this.languageSetup();
    this.router.navigate(['/timeline']);
  }
  navForgetPass() {
    this.router.navigate(['/login/forget-pass']);
  }
  navSetting() {
    this.router.navigate(['/settings']);
  }
  navChatwithId(id) {
    this.router.navigate([`/chat/direct-chat/${id}`]);
  }
  navMainChat() {
    this.router.navigate(['/chat']);
  }

  navGroupChatwithId(id) {
    this.router.navigate([`/chat/group-chat/${id}`]);
  }
  navIntro() {
    this.router.navigate([`/intro`]);
  }


  checkBasicElseRelodApp() {
    if (!this.userDetail && this.langSetupFLag === false) {
      this.apiService.connectFuntion();
      this.setUpUser();
      window.location.reload();
      // alert('relod');
    }
  }
  setSportsList() {
    if (!this.sportsList) {
      this.apiService.connectFuntion();
      this.apiService.getSportLists().subscribe((res: any) => {
        this.sportsList = res.message;
        this.getSportsList();
        return true;
      }, error => {
        this.networkError();
      });
    }
  }
  getSportsList() {
    if (this.sportsList) {
      return this.sportsList;
    } else {
      this.setSportsList();
    }
  }
  getCountryList() {
    if (!this.countryList) {
      this.apiService.connectFuntion();
      this.apiService.getCountryList().subscribe((res: any) => {
        this.countryList = res.message;
        return this.countryList;
      }, error => {
        this.networkError();
      });
    } else {
      return this.countryList;
    }
  }
  exitKeyBoard() {
    this.keyboard.hide();
  }
  showKeyBoard() {
    this.keyboard.show();
  }
  async okButtonMessageAlert(data) {
    const alert = await this.alertController.create({
      message: data,
      buttons: ['OK']
    });
    await alert.present();
  }

  async noNetworkAlert() {
    const alert = await this.alertController.create({
      header: 'Oops!!!',
      message: 'Something went wrong ! Please check your Network connection',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000
    });
    toast.present();
  }

  setUpUser() {
    this.apiService.connectFuntion();
    this.introStatus = Number(localStorage.getItem('intro_status'));
    this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
    if (this.userDetail) {
      this.eventCustom.publish('userDetail', this.userDetail);
      localStorage.setItem('profileLang', this.userDetail.language);
    }

    if (this.langSetupFLag === false && this.userDetail) { this.languageSetup(); }
    this.apiService.reloadApp();
  }

  getUserDetails() {
    this.apiService.connectFuntion();
    return JSON.stringify(this.userDetail);
    // if (this.userDetail !== null) {
    //   return JSON.stringify(this.userDetail);
    // } else {
    //   this.setUpUser();
    //   this.getUserDetails();
    // }
  }

  userAddonDetails() {
    // this.friendsList = [1, 1, 1, 1];
    if (!this.friendsList && this.userDetail) {
      this.apiService.getFriendsList(this.userDetail.id).subscribe((res: any) => {
        this.apiService.connectFuntion();
        this.friendsList = res.message;
        // localStorage.setItem('myMinors', JSON.stringify(this.friendsList));
      }, error => {
        this.networkError();
      });
    }
    // // Lagacy Depricated
    // setTimeout(() => {
    //   if (this.favSports.length <= 1) {
    //     this.apiService.getFollowingSportsData(this.userDetail.id).subscribe((res: any) => {
    //       this.apiService.connectFuntion();
    //       const followSports = res.message;
    //       // tslint:disable-next-line: prefer-for-of
    //       for (let v = 0; v < followSports.length; v++) {
    //         if (followSports[v].sport_id !== null) {
    //           this.favSports.push(followSports[v].sport_id);
    //         }
    //       }
    //     }, error => {
    //       this.networkError();
    //     });
    //   }
    // }, 10000);
  }

  getIntroStatus() {
    return JSON.parse(localStorage.getItem('intro_status'));
  }

  setIntroStatus(intro) {
    localStorage.setItem('intro_status', JSON.stringify(intro));
  }

  languageSetup() {
    this.apiService.connectFuntion();
    let lang: string; // Device Detected Language
    let deviceLang;
    if (this.platform.is('hybrid')) {
      // this.globalization.getPreferredLanguage().then(langInstall => {
      //   deviceLang = langInstall.value.split('-');
      //   deviceLang = deviceLang[0];
      //   switch (deviceLang) {

      //     case 'hi': {
      //       lang = 'हिंदू';
      //       break;
      //     }
      //     case 'en': {
      //       lang = 'English';
      //       break;
      //     }
      //     case 'tr': {
      //       lang = 'türk';
      //       break;
      //     }
      //     case 'fr': {
      //       lang = 'français';
      //       break;
      //     }
      //     case 'fa': {
      //       lang = 'farsça';
      //       break;
      //     }
      //     case 'Ja': {
      //       lang = 'japonca';
      //       break;
      //     }
      //     case 'el': {
      //       lang = 'yunanca';
      //       break;
      //     }
      //     case 'ko': {
      //       lang = 'korece';
      //       break;
      //     }
      //     case 'es': {
      //       lang = 'español';
      //       break;
      //     }
      //     case 'it': {
      //       lang = 'italiano';
      //       break;
      //     }
      //     case 'ru': {
      //       lang = 'pусский';
      //       break;
      //     }
      //     case 'nl': {
      //       lang = 'nederlands';
      //       break;
      //     }
      //     case 'ar': {
      //       lang = 'عربى';
      //       break;
      //     }
      //     case 'hu': {
      //       lang = 'magyar nyelv';
      //       break;
      //     }
      //     case 'he': {
      //       lang = 'עִברִית';
      //       break;
      //     }
      //     case 'fil': {
      //       lang = 'filipino';
      //       break;
      //     }
      //     case 'el': {
      //       lang = 'eλληνικά';
      //       break;
      //     }
      //     case 'pa': {
      //       lang = 'ਪੰਜਾਬੀ';
      //       break;
      //     }
      //     case 'ka': {
      //       lang = 'ქართული';
      //       break;
      //     }
      //     case 'it': {
      //       lang = 'italyanca';
      //       break;
      //     }
      //     case 'ru': {
      //       lang = 'Русский язык';
      //       break;
      //     }
      //     case 'az': {
      //       lang = 'Азәрбајҹан дили';
      //       break;
      //     }
      //     case 'zh': {
      //       lang = '中文';
      //       break;
      //     }
      //     case 'sq': {
      //       lang = 'shqip';
      //       break;
      //     }
      //     case 'bs': {
      //       lang = 'bosanski';
      //       break;
      //     }
      //     case 'bg': {
      //       lang = 'Абонирай се';
      //       break;
      //     }
      //     case 'cs': {
      //       lang = 'čeština';
      //       break;
      //     }
      //     case 'fi': {
      //       lang = 'suomi';
      //       break;
      //     }
      //     case 'nb': {
      //       lang = 'norsk';
      //       break;
      //     }
      //     case 'tk': {
      //       lang = 'түркmенче';
      //       break;
      //     }
      //     case 'ro': {
      //       lang = 'limba română';
      //       break;
      //     }
      //     case 'uz': {
      //       lang = 'ozbekçe';
      //       break;
      //     }
      //     case 'kk': {
      //       lang = 'Қазақ тілі';
      //       break;
      //     }
      //     case 'hr': {
      //       lang = 'hrvatski';
      //       break;
      //     }
      //     case 'ms': {
      //       lang = 'bahasa melayu';
      //       break;
      //     }
      //     case 'id': {
      //       lang = 'endonezce';
      //       break;
      //     }
      //     case 'pl': {
      //       lang = 'język polski';
      //       break;
      //     }
      //     case 'de-CH': {
      //       lang = 'schwyzerdütsch';
      //       break;
      //     }
      //     case 'ps': {
      //       lang = 'پښتو';
      //       break;
      //     }
      //     case 'be': {
      //       lang = 'Беларуская мова';
      //       break;
      //     }
      //     case 'et': {
      //       lang = 'eesti keel';
      //       break;
      //     }
      //     case 'is': {
      //       lang = 'Íslenska';
      //       break;
      //     }
      //     case 'lv': {
      //       lang = 'lietuvių kalba';
      //       break;
      //     }
      //     case 'ky': {
      //       lang = 'قىرعىز تىلى';
      //       break;
      //     }
      //     case 'mo': {
      //       lang = 'лимба молдовеняскэ';
      //       break;
      //     }
      //     case 'sk': {
      //       lang = 'slovenčina';
      //       break;
      //     }
      //     case 'sl': {
      //       lang = 'slovenščina';
      //       break;
      //     }
      //     case 'vi': {
      //       lang = 'tiếng việt';
      //       break;
      //     }

      //     default: {
      //       lang = 'english';
      //       break;
      //     }
      //   }
      // });
    }
    localStorage.setItem('deviceLanguage', lang ? lang : 'english');
    this.initLang();
  }

  initLang() {
    // Prompt IF change Fun here
    this.apiService.connectFuntion();
    const langDevice = (localStorage.getItem('deviceLanguage') || 'english');
    const profileLang = (localStorage.getItem('profileLang') || 'english');
    this.langLibrary = JSON.parse(localStorage.getItem('languageSetup'));
    if (this.langLibrary !== null) {
      this.langSetupFLag = true;
      this.apiService.reloadApp();
    }

    if (this.langSetupFLag === false) {
      this.apiService.connectFuntion();
      // console.log('calling api for lang');
      this.apiService.languageFile(profileLang).subscribe((res: any) => {
        this.apiService.connectFuntion();
        if (res.success === 1) {
          this.langLibrary = res.message.Sheet1;
          localStorage.setItem('languageSetup', JSON.stringify(this.langLibrary));
          this.langSetupFLag = true;
        }
      }, error => {
        this.networkError();
      });
    }
  }

  getLangByCode(codeToFind: string): any {
    if (this.langLibrary) {
      const xDx = this.langLibrary.filter(d => d.code === codeToFind);
      if (xDx[0]) {
        return (xDx[0]).response;
      }
    } else {
      this.initLang();
    }
  }

  // checkIfGuardian() {
  //   // return true;
  //   return false;
  // }
  // checkIfMinor(){
  //   // return false;
  //   return true;
  // }

  formatDateMax() {
    const dd = new Date();
    let day = '' + dd.getDate();
    let month = '' + (dd.getMonth() + 1);
    const year = (dd.getFullYear() + 100);
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
  formatDateMin() {
    const dd = new Date();
    let day = '' + dd.getDate();
    let month = '' + (dd.getMonth() + 1);
    const year = (dd.getFullYear() - 13);
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  minToday() {
    const dd = new Date();
    let day = '' + dd.getDate();
    let month = '' + (dd.getMonth() + 1);
    const year = dd.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
  max5yeras() {
    const dd = new Date();
    let day = '' + dd.getDate();
    let month = '' + (dd.getMonth() + 1);
    const year = dd.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [(year + 5), month, day].join('-');
  }
  getYYYY_MM_DD(x) {
    if (x) {
      x.split('T', 1);
      const pubdate = new Date(x).toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '');
      return (pubdate.split(' ', 1)[0]);
    }
    // x.split('T', 1);
    // return String(x[0]);

    // return moment(x).format('YYYY-MM-DD');
  }
  getAge(x) {
    const birth = parseInt((this.getYYYY_MM_DD(x).split('-'))[0]);
    const today = parseInt((this.minToday().split('-'))[0]);

    return today - birth;
  }
  getTimeStamp() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    const dateTime = date + '-' + time;
    return dateTime;
  }

  compareObjectsEqual(obj1: object, obj2: object): boolean {
    return (deepEqual(obj1, obj2));
  }

  formatString(strng) {
    if (strng) {
      const len = strng.length;
      for (let x = 0; x <= len / 2; x++) {
        for (let j = 0; j <= len; j++) {
          if (strng.substr(0, 1) === '\n') {
            strng = strng.slice(1);
          }
        }
        for (let j = 0; j <= len; j++) {
          if (strng.substr(0, 1) === ' ') {
            strng = strng.slice(1);
          }
        }

        for (let i = 0; i <= len; i++) {
          if (strng.substr(-1, len) === '\n') {
            strng = strng.slice(0, -1);
          }
        }
        for (let i = 0; i <= len; i++) {
          if (strng.substr(-1, len) === ' ') {
            strng = strng.slice(0, -1);
          }
        }
      }
      return strng;
    }
  }
  async showLoaderWait() {
    const loaderWait = await this.loadingController.create({
      message: this.getLangByCode('post_error2')
    });
    if (this.loderUp === false) {
      this.loderUp = true;
      await loaderWait.present();
    }

    loaderWait.onDidDismiss().then((dis) => {
      this.loderUp = false;
    });
  }
  hideLoaderWait() {
    const iniClose = setInterval(() => {
      if (this.loderUp === true) {
        setTimeout(() => {
          this.loadingController.dismiss();
        }, 180);
        clearInterval(iniClose);
      }
    }, 20);
  }

  hideLoaderWaitAMin() {
    const iniClose1 = setInterval(() => {
      if (this.loderUp === true) {
        setTimeout(() => {
          this.loadingController.dismiss();
        }, 1000);
        clearInterval(iniClose1);
      }
    }, 20);
  }
  //   search(searchTerm, searchArry, whatToFind) {
  //   return this.filter(searchArry, searchTerm, whatToFind || null);
  //   }

  //  filter(items: any[], terms: string , whatToFind : any): any[] {


  //   if (!whatToFind) { return []; }
  //    if (!items) { return []; }
  //    if (!terms) { return items; }
  //    terms = terms.toLowerCase();
  //    whatToFind = JSON.stringify(whatToFind);
  //    var ty = "team_name";
  //    return items.filter(it => {
  //      console.log("it", it.whatToFind);

  //   //  return it.whatToFind.toLowerCase().includes(terms);

  //    });
  //  }
  networkError() {

    // console.log('error in network');
    localStorage.setItem('online', 'false');
    // this.navLogin();
  }
  setScoutStatus(x) {
    this.scoutStatus = x;
  }
  getScoutStatus() {
    return this.scoutStatus;
  }
  setGuardianStatus(x) {
    this.guardiaSatus = x;
  }
  getGuardianStatus() {
    return this.guardiaSatus;
  }

  initVersioningCheck() {
    // console.log('checkking versioning');
    if (Capacitor.platform !== 'web') {
      let code: number;
      let version: string;
      this.appVersion.getVersionCode().then((x: any) => {
        code = Number(x);
      });
      this.appVersion.getVersionNumber().then((x: any) => {
        version = String(x);
      });


      const initer = setInterval(async () => {
        if (code && version) {
          if (this.platform.is('android')) {
            this.apiService.versionCheck('android').subscribe((res: any) => {
              if (res.message[0]) {
                const dataVersion: string = String(res.message[0].version);
                const dataCode: number = parseInt(res.message[0].code);
                // console.log('code server::', dataCode, ' :: yours: ', code);
                // console.log('version server::', dataVersion, ' :: yours: ', version);
                const versiovCheck = this.cmpVersion(version, dataVersion);
                if (code > dataCode || versiovCheck === false){
                    this.eventCustom.publish('versionCheck', false);
                    clearInterval(initer);
                } else if (code < dataCode || versiovCheck === true) {
                  this.eventCustom.publish('versionCheck', true);
                  clearInterval(initer);
                } else if (code === dataCode) {
                  this.eventCustom.publish('versionCheck', false);
                  clearInterval(initer);
                }
              }
            });

          } else if (this.platform.is('ios' || 'iphone')) {
            this.apiService.versionCheck('ios').subscribe((res: any) => {
              if (res.message[0]) {
                const dataVersion: string = String(res.message[0].version);
                const dataCode: number = parseInt(res.message[0].code);

                // console.log('code server::', dataCode, ' :: yours: ', code);
                // console.log('version server::', dataVersion, ' :: yours: ', version);
                const versiovCheck = this.cmpVersion(version, dataVersion);
                // console.log('versionCheck:::::::::::::::', versiovCheck);
                // true if a smaller
                if (code > dataCode || versiovCheck === false) {
                    this.eventCustom.publish('versionCheck', false);
                    clearInterval(initer);
                } else if (code < dataCode || versiovCheck === true) {
                  this.eventCustom.publish('versionCheck', true);
                  clearInterval(initer);
                } else if (code === dataCode) {
                  this.eventCustom.publish('versionCheck', false);
                  clearInterval(initer);
                }
              }
            });
          }
        }
      }, 80);

    } else {
      return null;
    }
  }
  cmpVersion(a, b) {
    // true if a smaller
    let i;
    let cmp;
    let len;
    a = (a + '').split('.');
    b = (b + '').split('.');
    len = Math.max(a.length, b.length);
    for (i = 0; i < len; i++) {
      if (a[i] === undefined) {
        a[i] = '0';
      }
      if (b[i] === undefined) {
        b[i] = '0';
      }
      cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
      if (cmp !== 0) {
        return (cmp < 0 ? true : false);
      }
    }
    return 0;
  }
  requireToUpdate() {
    // alert('Require to update');
  }
  getUserStatus(id) {
    localStorage.removeItem('userStatus');
    // console.log('id:::::::', id);
    this.apiService.getUserStatus(id).subscribe((res: any) => {
      const userData = res.message;
      localStorage.setItem('userStatus', JSON.stringify(userData));
    });
  }
  getMyMinors(id) {
    localStorage.removeItem('myMinors');
    this.apiService.getGuardedAthletes(id).subscribe((res: any) => {
      if (res) {
        localStorage.setItem('myMinors', JSON.stringify(res.message));
      }
    });
  }
  getScoutStatusFrom(){
    this.apiService.getScoutFilePaymentStatus(this.userDetail.id).subscribe((res: any) => {
      if(res.message.fileCount === 2 && res.message.paymentDetails === this.userDetail.id){
        this.apiService.getScoutPaymentStatus(this.userDetail.id).subscribe((res: any) => {
          if(res.message.status === 1 && res.message.mode !== null){
            this.setScoutStatus(true);
            this.router.navigate(['/scouts']);
          }
        });
      }
    });
  }

  initSockets() {
    // this.socketAPI.on('onlineusers', (data) => { });
    // this.socketAPI.on('receive-message', (msg) => { });
    // this.socketAPI.on('receive-group-message', (data) => { });
    // this.socketAPI.on('accept-groupchat-join', (res) => { });
    // this.socketAPI.on('accept-team-join', (res) => { });
    // // this.socketAPI.on('wallPost-event', (data) => { });
    // this.socketAPI.on('like-event', (data) => { });
    // this.socketAPI.on('share-event', (data) => { });
    // this.socketAPI.on('group-event', (data) => { });
    // this.socketAPI.on('comment-event', (data) => { });
    // this.socketAPI.on('mention-event', (data) => { });
    // this.socketAPI.on('friend-request', (data) => { });
    // this.socketAPI.on('team-create-event', (data) => { });
    // this.socketAPI.on('team-create', (data) => { });
    // this.socketAPI.on('team-change-event', (data) => { });
    // this.socketAPI.on('team-delete-event', (msg) => { });
    // this.socketAPI.on('like-event', (msg) => { });
    // this.socketAPI.on('accept-friend', (res) => { });
    // this.socketAPI.on('send-friend-request', (res) => { });
    // this.socketAPI.on('cancel-friend-request', (res) => { });
    // this.socketAPI.on('invite-team-member', (res) => { });
    // this.socketAPI.on('remove-team-user-invite', (res) => { });
    // this.socketAPI.on('invite-groupchat-member', (res) => { });
    // this.socketAPI.on('remove-groupchat-user-invite', (res) => { });
  }
  userQuickInfo(){
    let x = { teams: null, groups: null, friends: null, events: null };
    // Teams
    this.apiService.getTeamList(this.userDetail.id).pipe().subscribe((allTeam: any) => {
      x.teams = Object.keys(allTeam.message).length;
      // console.log('allTeam:::::',  Object.keys(allTeam.message).length);
    });
    // Groups
    this.apiService.getGroupChatList(this.userDetail.id).subscribe((res: any) => {
      x.groups = Object.keys(res.message).length;
      // console.log('allTeam:::::',  Object.keys(res.message).length);
    });
    // Friends
    this.apiService.getFriendsList(this.userDetail.id).subscribe((res: any) => {
      x.friends = Object.keys(res.message).length;
      // console.log('allTeam:::::',  Object.keys(res.message).length);
    })
    // Events
    this.apiService.getAllMyTeamEvents(this.userDetail.id).pipe().subscribe((res: any) => {
      x.events = Object.keys(res.message).length;
      // console.log('allTeam:::::',  Object.keys(res.message).length);
    });
     return x;
  }
}
