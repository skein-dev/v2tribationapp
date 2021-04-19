import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController, IonSelect, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { FcmServiceService } from 'src/app/services/fcm-service.service';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { Plugins } from '@capacitor/core';
import { environment } from '../../../environments/environment';
import { IntroLanguageComponent } from 'src/app/components/intro-language/intro-language.component';

const { SplashScreen } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  environment: any;

  public toplogo = 'logo.png';
  loaderToShow: Promise<void>;
  log: FormGroup;
  devicetoken: any;
  loginUserDetail: any;
  isLoading: boolean;
  signupp: any;
  languagee: any;
  getlanguage: any;
  username: any;
  device: any;
  pswrd: any = '';
  mobileOffline: string;
  showPasswordText: any;
  minorList: any[] = [];
  filteredMinorList: any[] = [];

  // Init
  showMyMinnorlist = false;
  slectedMinor: any;
  selectedOne = false;
  avilableMinors = false;
  hide = true;
  buttonLogin = true;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  pawwordForMinor = '';
  disableSignInForMinor = true;
  // Strings
  emaiL = 'Email';
  passworD = 'Password';
  signInString = 'Sign In';
  dontHaveAccString = 'Don\'t have an account?';
  signUpString = 'Sign up';
  forgotPassString = 'Forgot Password';
  pleaseWaitString = 'Please Wait…';
  addSectionString = 'Add Section';
  loginAsMinorString = 'Login as Minor';
  confirmPassOwnString = 'Please enter password of your own account';
  count = 1;
  logInOrNot = true;
  languageString = 'Change language';
  xyzString = 'xyz';
  lastLoginUser: any;
  constructor(
    private loadingController: LoadingController,
    private socket: Socket,
    private api: ApiService,
    private alertController: AlertController,
    private modalController: ModalController,
    private eventCustom: EventsCustomService,
    private actRouter: ActivatedRoute,
    private router: Router,
    private utilServ: GenralUtilsService,
    private fcmServ: FcmServiceService) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
      console.log('Login Sending data', JSON.parse(this.utilServ.getUserDetails()));
      this.lastLoginUser = JSON.parse(localStorage.getItem('lastLoginUser'));
      this.logInOrNot = this.utilServ.checkAlredyLoggedIn();
      if (this.logInOrNot === true) {
        this.utilServ.navTimeline();
        this.api.reloadApp();
      } else if (this.logInOrNot === false) {
        setTimeout(() => {
          SplashScreen.hide();
          const minor = JSON.parse(localStorage.getItem('myMinors'));
          if (minor.length > 0) {
            this.avilableMinors = true;
            this.minorList = minor;
            this.filteredMinorList = this.minorList;
          }
        }, 500);
      }
    });
  }

  ngOnInit() {
    this.createform();
    this.environment = environment;

    setTimeout(() => {
      SplashScreen.hide();
    }, 100);
  }

  private createform() {
    this.log = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@'
        + '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    });
  }

  emailCheck() {
    this.username = this.log.value.username.trim();
    this.username = this.username.replace(/\s/g, '');
  }

  async okButtonMessageAlert(data) {
    const alert = await this.alertController.create({
      message: data,
      buttons: ['OK']
    });

    alert.onDidDismiss().then((data) => {
      this.buttonLogin = true;
    });
    if (this.buttonLogin === false) {
      await alert.present();
    }
  }
  async noNetworkAlert() {
    const alert = await this.alertController.create({
      header: 'Oops!!!',
      message: 'Something went wrong ! Please check your Network connection',
      buttons: ['OK']
    });
    alert.onDidDismiss().then((data) => {
      this.buttonLogin = true;
    });
    if (this.buttonLogin === false) {
      await alert.present();
    }
  }

  // rootpage() {
  //   // console.log(':::::::::::::::::::::loginRoot::::::::::::::::::::::::::::');
  //   this.buttonLogin = false;
  //   this.loadingController.dismiss();

  //   this.fcmServ.deleteToken();
  //   this.devicetoken = this.fcmServ.newToken();

  //   this.device = localStorage.getItem('device');

  //   this.eventCustom.subscribe('newDeviceTocken', (token: any) => {

  //     // this.hide = !this.hide;
  //     this.devicetoken = token;
  //     console.log('this.devicetoken', this.devicetoken);
  //     localStorage.setItem('devicetoken', JSON.stringify(token));
  //     if (this.devicetoken) {
  //       this.api.userlogin(this.log.value.username, this.log.value.password, this.devicetoken, this.device)
  //         .subscribe((res: any) => {
  //           if (res.success === 0) {
  //             this.okButtonMessageAlert(res.message);
  //             // this.hide = true;
  //           } else if (res.success === 1) {
  //          const localLang = localStorage.getItem('profileLang') || res.message.language ||'english';
  //          this.api.saveChangedLanguage(res.message.id, localLang).subscribe((language: any) => {
  //           if(language){
  //             res.message.language = localLang;
  //             localStorage.setItem('userdetail', JSON.stringify(res.message));
  //             localStorage.removeItem('lastLoginUser');
  //             localStorage.setItem('lastLoginUser', JSON.stringify(res.message));
  //             this.count += 1;
  //             this.utilServ.setUpUser();
  //             this.showLoader();
  //             // this.fcmServ.testFun();
  //             this.log.reset();
  //             this.utilServ.getMyMinors(res.message.id);
  //             this.utilServ.getUserStatus(res.message.id);
  //             this.buttonLogin = true;
  //             setTimeout(() => {
  //               if (this.utilServ.userDetail === null) {
  //                 this.utilServ.setUpUser();
  //                 this.utilServ.hideLoaderWait();
  //                 this.utilServ.hideLoaderWaitAMin();
  //               }
  //             }, 1000);
  //           }
  //         });
  //        }
  //         }, error => {
  //           // console.log('Login Error', error);
  //           this.noNetworkAlert();
  //         });
  //     } else {
  //       // console.log('no token');
  //       this.noNetworkAlert();
  //     }
  //   });
  // }



  // -------------For serve-------------------------
  rootpage() {
    this.hideLoader();
    this.buttonLogin = false;
    // this.hide = !this.hide;
    this.devicetoken = localStorage.getItem('devicetoken');
    this.device = localStorage.getItem('device');
    if (!this.devicetoken) {
      this.devicetoken = this.fcmServ.newToken();
    }
    console.log(this.log.value.username, this.log.value.password, this.devicetoken, this.device);
    this.api.userlogin(this.log.value.username, this.log.value.password, this.devicetoken, this.device)
      .subscribe((res: any) => {
        if (res.success === 0) {
          this.okButtonMessageAlert(res.message);
          // this.hide = true;
        } else if (res.success === 1) {
          const localLang = localStorage.getItem('profileLang') || res.message.language || 'english';
          this.api.saveChangedLanguage(res.message.id, localLang).subscribe((language: any) => {
            if (language) {
              res.message.language = localLang;
              localStorage.setItem('userdetail', JSON.stringify(res.message));
              localStorage.removeItem('lastLoginUser');
              localStorage.removeItem('myMinors');
              this.utilServ.setUpUser();
              this.showLoader();
              this.log.reset();
              this.buttonLogin = true;
              localStorage.setItem('lastLoginUser', JSON.stringify(res.message));
              this.utilServ.getMyMinors(res.message.id);
              this.utilServ.getUserStatus(res.message.id);
            }
          });

        }
      },
        error => {
          console.log('Login Error', error);
          this.noNetworkAlert();
        });
  }

  signup() {
    this.utilServ.navSignup();
  }

  resetPass() {
    this.utilServ.navForgetPass();
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: this.pleaseWaitString
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
        this.eventCustom.destroy('newDeviceTocken');
      });
      for (let i = 1; i < this.count; i++) {
        this.loadingController.dismiss();
      }
      this.hideLoader();
    });
  }

  // ------------- For serve-------------------------
  // showLoader() {
  //   this.loaderToShow = this.loadingController.create({
  //     message: this.pleaseWaitString
  //   }).then((res) => {
  //     res.present();
  //     res.onDidDismiss().then((dis) => {
  //       this.utilServ.navTimeline();
  //     });
  //   });
  //   this.hideLoader();
  // }

  hideLoader() {
    this.utilServ.setUpUser();
    setTimeout(() => {
      this.loadingController.dismiss();
      this.utilServ.navTimeline();
      this.loadingController.dismiss();
      this.api.reloadApp();
      localStorage.setItem('setupAfterLogin', 'true');
    }, 2500);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }
  getLanguageStrings() {
    if (localStorage.getItem('langSetupFLag') == 'true') {
      this.xyzString = this.utilServ.getLangByCode('sign_in');
      this.signInString = this.utilServ.getLangByCode('sign_in');
      this.dontHaveAccString = this.utilServ.getLangByCode('pls_sign_up');
      this.signUpString = this.utilServ.getLangByCode('sign_up');
      this.forgotPassString = this.utilServ.getLangByCode('forgotpassword');
      this.pleaseWaitString = this.utilServ.getLangByCode('please_wait');
      this.addSectionString = this.utilServ.getLangByCode('addSectionString');
      this.emaiL = this.utilServ.getLangByCode('email');
      this.passworD = this.utilServ.getLangByCode('password');
      this.languageString = this.utilServ.getLangByCode('language');
    }
  }


  popMinorList() {
    this.showMyMinnorlist = true;
    // alert('minor list will be here');
  }

  closeMinorPop() {
    this.showMyMinnorlist = false;
    this.setFilteredItem('');
    this.selectedOne = false;
  }
  logMeInAs(m) {
    this.setFilteredItem(m.name);
    this.selectedOne = true;
    this.slectedMinor = m;
    console.log(this.slectedMinor);
  }
  setFilteredItem(x) {
    // console.log(x);
    this.filteredMinorList = this.filter(this.minorList, x || null);
    // console.log(this.friendsList);
  }

  filter(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(terms);
    });
  }
  validateSigninMinor(x: string) {
    if (x.length < 20 && x.length > 6) {
      this.disableSignInForMinor = false;
    } else {
      this.disableSignInForMinor = true;
    }
  }

  minorLogin() {
    this.buttonLogin = false;
    this.loadingController.dismiss();
    this.fcmServ.deleteToken();
    this.devicetoken = this.fcmServ.newToken();
    this.device = localStorage.getItem('device');
    this.eventCustom.subscribe('newDeviceTocken', (token: any) => {
      // this.hide = !this.hide;
      this.devicetoken = token;
      console.log(this.lastLoginUser.email, this.pawwordForMinor, this.devicetoken, this.device, this.slectedMinor.id);
      console.log('this.devicetoken', this.devicetoken);
      localStorage.setItem('devicetoken', JSON.stringify(token));
      if (this.devicetoken) {
        this.api.userloginAsMinor(this.lastLoginUser.email, this.pawwordForMinor, this.devicetoken, this.device, this.slectedMinor.id)
          .subscribe((res: any) => {
            if (res.success === 0) {
              this.okButtonMessageAlert(res.message);
              // this.hide = true;
            } else if (res.success === 1) {
              localStorage.setItem('userdetail', JSON.stringify(res.message));
              this.count += 1;
              this.utilServ.setUpUser();
              this.showLoader();
              // this.fcmServ.testFun();
              this.log.reset();
              this.utilServ.getUserStatus(res.message.id);
              this.buttonLogin = true;
              setTimeout(() => {
                if (this.utilServ.userDetail === null) {
                  this.utilServ.setUpUser();
                  this.utilServ.hideLoaderWait();
                  this.utilServ.hideLoaderWaitAMin();
                }
              }, 1000);
            }
          },
            error => {
              console.log('Login Error', error);
              this.noNetworkAlert();
            });

      } else {
        // console.log('no token');
        this.noNetworkAlert();
      }
    });

  }




  //  For serve  
  // minorLogin() {
  //   this.buttonLogin = false;
  //   this.loadingController.dismiss();
  //   this.devicetoken = '';

  //   console.log(this.lastLoginUser.email, this.pawwordForMinor, this.devicetoken, this.device, this.slectedMinor.id);
  //   console.log('this.devicetoken', this.devicetoken);

  //   this.api.userloginAsMinor(this.lastLoginUser.email, this.pawwordForMinor, this.devicetoken, this.device, this.slectedMinor.id)
  //     .subscribe((res: any) => {
  //       if (res.success === 0) {
  //         this.okButtonMessageAlert(res.message);
  //         // this.hide = true;
  //       } else if (res.success === 1) {
  //         localStorage.setItem('userdetail', JSON.stringify(res.message));
  //         this.count += 1;
  //         this.utilServ.setUpUser();
  //         this.showLoader();
  //         // this.fcmServ.testFun();
  //         this.log.reset();
  //         this.buttonLogin = true;
  //         this.utilServ.getUserStatus(res.message.id);
  //         setTimeout(() => {
  //           if (this.utilServ.userDetail === null) {
  //             this.utilServ.setUpUser();
  //             this.utilServ.hideLoaderWait();
  //             this.utilServ.hideLoaderWaitAMin();
  //           }
  //         }, 1000);
  //       }
  //     },
  //       error => {
  //         console.log('Login Error', error);
  //         this.noNetworkAlert();
  //       });
  // }

  async changeLanguage() {
    const modal = await this.modalController.create({
      component: IntroLanguageComponent,
    });
    modal.onDidDismiss().then(data => {
      if (data.data) {

      }
    });
    return await modal.present();
  }
}
