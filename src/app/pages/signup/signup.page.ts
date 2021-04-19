import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { Platform, ModalController } from '@ionic/angular';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { SelectCountryComponent } from 'src/app/components/select-country/select-country.component';
import { DomSanitizer } from '@angular/platform-browser';
// import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Plugins } from '@capacitor/core';
const { Device } = Plugins;
import { AlertController } from '@ionic/angular';
import { IonSelect } from '@ionic/angular';


const trimValidator: ValidatorFn = (control: FormControl) => {
  if (control.value) {
    if (control.value.startsWith(' ')) {
      return {
        'trimError': { value: 'control has leading whitespace' }
      };
    }
  }
  return null;
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  @ViewChild('userInput') userInputViewChild: ElementRef;
  @ViewChild('scoutTag') wishTobeScoutTag: IonSelect;

  hideGoogle = false;
  hideApple = false;
  signup: FormGroup;
  maxDate: string;
  minDate: string;
  signupvalidation: any;
  countryCode;
  invalidEmail: boolean;
  recaptcha_value: boolean = false;
  email;
  recaptchaValue = false;
  invalid_email: boolean;
  countryName: string;
  countryValue = '0';
  environment: any;
  pswrd: any;
  pic_url: any = '';
  Value: any;
  blob: any;
  picToSend: any = '';
  userInputElement: HTMLInputElement;
  signUpGoogle = null;
  signUpApple = null;
  showAppleSignIn: boolean;
  showGooleSignIn: boolean;


  lastnameModel;
  firstnameModel;
  emailModel;
  passwordModel;
  newPasswordModel;
  dobModel;
  genderModel;
  cityModel;
  countryModel;
  termsModel;
  showcPasswordText;
  localLanguage: string;
  profileImage: any;
  blobImg: any = null;
  wantsToBeScoutsDisplayText;
  willBeScout: any;
  toBeScoutValue = 0;


  // Init
  hide = true;
  passwordType = 'password';
  passwordIcon = 'eye-off';

  passwordConType = 'password';
  passwordConIcon = 'eye-off';


  // Strings

  createAccountString = 'Create Account';
  accountCreatedString = 'Congratulations! Your account has been created successfully. Please verify your email address before logging in.';
  lastNameString = 'Last Name';
  firstNameString = 'First Name';
  emailString = 'Email';
  passwordString = 'Password';
  newPasswordString = 'Confirm password';
  DOBString = 'Date of Birth';
  maleString = 'Male';
  femaleString = 'Female';
  citYString = 'City';
  selectCountryString = 'Select Country';
  registerNowString = 'Register Now';
  termsIAcceptString = 'I accept the';
  termsConditionString = 'Terms of services & conditions';
  termsUsingFeatureString = 'of using this feature';
  signInString = 'Login';


  alreadyhaveaccountString = 'I already have an account';
  noSpaceString = 'No Space';
  enterLastNameString = 'Please Enter your Last Name';
  enterFirstNameString = 'Please Enter your First Name';
  emailErrorString = 'Email Syntax Error';
  enterEmailString = 'Please Enter your Email';
  enterPasswordString = 'Please Enter your password';
  password6charString = 'Password should be more then 6 char';
  password30charString = 'Password should be 30 char short';
  PatternDoesNotMatchString = 'Password must contain at least one lowercase, one uppercase and one special character such as ! @ $';
  confirmPasswordRequiredString = 'Please Confirm Password';
  passwordNotMatchString = 'Password does not match';
  enterDobString = 'Please Enter data of birth';
  selectGenderString = 'Please select Gender';
  enterCitySting = 'Please Enter City';
  pleaseSelectCountrySting = 'Please Select Country';
  exitEmailString = 'This email is already registered';
  wantsToBeScoutsString = 'Wish to be a scouted';
  neverScoutString = 'Don\'t want to be a scouted';
  changeScouteAppString = "you can change scout setting from the application. Go to settings > privacy settings.";
  setImage: any;
  termpE;
  externalPic;
  // showAppleSignIn: boolean;
  constructor(
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private utilServ: GenralUtilsService,
    private actRouter: ActivatedRoute,
    private googleplus: GooglePlus,
    private alertController: AlertController,
    private eventCustom: EventsCustomService,
    private nativeLib: DeviceNativeApiService,
    private modalController: ModalController,
    // private signInWithApple: SignInWithApple
  ) {
    this.actRouter.queryParams.subscribe(() => {
      this.willBeScout = 0;
      this.wishToBeScout(this.willBeScout);


      this.setImage = null;
      this.maxDate = this.utilServ.formatDateMin();
      this.minDate = this.utilServ.formatDateMax();
      // this.showAppleSignIn = this.platform.is('ios');
      // this.showGooleSignIn = this.platform.is('android') || this.platform.is('ios');

      this.createform1();
      this.apiService.signup_validation().pipe().subscribe((res: any) => {
        // console.log(res);
        this.signupvalidation = res.message.info;
      });
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
    this.environment = environment;
    this.localLanguage = localStorage.getItem('deviceLanguage') || 'english';
  }
  // ngAfterViewInit() {
  //   // this.userInputElement = this.userInputViewChild.nativeElement;
  // }

  presentActionSheet() {
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        this.setImage = imgData.webPath;
        this.apiService.signup_mobile_temp(imgData.blob).subscribe((data: any) => {
          if (data.success === 1) {
            this.picToSend = String(data.message);
          } else { console.log('could not get image data'); }
        },
          (error: any) => {
            alert('Error' + JSON.stringify(error));
          });
        this.eventCustom.destroy('imageReady');
      }
    });
  }

  // pickImageFromDevice(event) {
  //   this.utilServ.showLoaderWait();
  //   if (event.target.files && event.target.files[0]) {
  //     const myFile = event.target.files;
  //     // tslint:disable-next-line: prefer-for-of
  //     for (let i = 0; i < myFile.length; i++) {
  //       const blob = new Blob([myFile[i]], { type: myFile[i].type });
  //       this.setImage = this.showImage(blob);
  //       this.apiService.signup_mobile_temp(blob).subscribe((data: any) => {
  //         if (data.success === 1) {
  //           this.picToSend = String(data.message);
  //           this.utilServ.hideLoaderWait();

  //           this.utilServ.hideLoaderWaitAMin();
  //           this.utilServ.hideLoaderWaitAMin();

  //         } else {
  //           this.utilServ.hideLoaderWaitAMin();
  //           this.utilServ.hideLoaderWaitAMin();
  //         }
  //       },
  //         (error: any) => {
  //           alert('Error' + JSON.stringify(error));
  //         });
  //     }
  //   }
  // }

  showImage(image) {
    const imageURL = window.URL.createObjectURL(image);
    return this.sanitizer.bypassSecurityTrustUrl(imageURL);
  }
  private createform1() {
    this.signup = new FormGroup({
      dob: new FormControl('', []),
      scout: new FormControl('', []),
      firstname: new FormControl('', Validators.compose([Validators.required, trimValidator])),
      lastname: new FormControl('', Validators.compose([Validators.required, trimValidator])),
      email: new FormControl('', Validators.compose([Validators.required, trimValidator, Validators.email, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])),
      gender: new FormControl('', []),
      city: new FormControl('', Validators.compose([Validators.required, trimValidator])),
      country: new FormControl('', Validators.required),
      terms: new FormControl(false, Validators.pattern('true')),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6),
      Validators.maxLength(30), trimValidator, Validators.pattern(/(?=^.{6,30}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/)])),
      confirmpassword: new FormControl('', Validators.compose([Validators.required,
      Validators.minLength(6), Validators.maxLength(30), trimValidator, this.equalto('password'), Validators.pattern(/(?=^.{6,30}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/)]))
    });
  }

  check() {
    this.signup.controls['confirmpassword'].reset();
  }

  signUpFun() {
    if (this.picToSend = '') {
      this.picToSend = this.termpE;
    }

    this.apiService.signup_mobile(
      this.signup.value.firstname,
      this.signup.value.lastname,
      this.signup.value.email,
      this.signup.value.confirmpassword,
      this.signup.value.dob,
      this.signup.value.gender,
      this.signup.value.city,
      this.countryValue,
      this.localLanguage,
      this.picToSend,
      this.externalPic,
      this.toBeScoutValue).subscribe((res: any) => {
        // console.log(res);
        if (res.success === 0) {
          this.exitEmail();
        } else if (res.success === 1) {
          this.signup.reset();
          this.successSignup();
        }
      }),
      error => {
        this.utilServ.okButtonMessageAlert('403 Forbidden / Access denied!\nAccess denied \n error');
      };
    localStorage.removeItem('signUp');
  }

  resolved(captchaResponse: string) {
    if (captchaResponse) {
      this.recaptcha_value = true;
    }
  }

  // password validation
  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): {
      [key: string]: any
    } => {
      let input = control.value;
      let isValid = control.root.value[field_name] === input;
      if (!isValid) {
        return {
          'equalTo': {
            isValid
          }
        };
      } else {
        return null;
      }
    };
  }


  email_field() {
    this.invalid_email = false;
  }

  emailTrim() {
    this.email = this.signup.value.email.trim();
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(this.email) === false) {
      this.invalid_email = true;
      return false;
    }
    return true;
  }

  // Choose Country
  async gotocountry() {
    const modal = await this.modalController.create({
      component: SelectCountryComponent,
    });
    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.countryModel = data.data.data.countryName;
        this.countryValue = data.data.data.countryCode;
        this.signup.get('country').setValue(`${this.countryModel}`)
      }
    });
    return await modal.present();
  }

  successSignup() {
    this.utilServ.okButtonMessageAlert(this.accountCreatedString);
    this.backtologin();
  }

  exitEmail() {
    this.utilServ.okButtonMessageAlert(this.exitEmailString);
  }

  backtologin() {
    this.utilServ.navLogin();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowConPassword() {
    this.passwordConType = this.passwordConType === 'text' ? 'password' : 'text';
    this.passwordConIcon = this.passwordConIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }
  getLanguageStrings() {
    if (localStorage.getItem('langSetupFLag') === "true") {
      this.createAccountString = this.utilServ.getLangByCode('common.button.createAccount');
      this.accountCreatedString = this.utilServ.getLangByCode('account_created');
      this.lastNameString = this.utilServ.getLangByCode('last_name');
      this.firstNameString = this.utilServ.getLangByCode('first_name');
      this.emailString = this.utilServ.getLangByCode('email');
      this.passwordString = this.utilServ.getLangByCode('password');
      this.newPasswordString = this.utilServ.getLangByCode('confirm_password');
      this.DOBString = this.utilServ.getLangByCode('dob');
      this.maleString = this.utilServ.getLangByCode('male');
      this.femaleString = this.utilServ.getLangByCode('female');
      this.citYString = this.utilServ.getLangByCode('city');
      this.selectCountryString = this.utilServ.getLangByCode('select_country');
      this.registerNowString = this.utilServ.getLangByCode('registernow');
      this.termsIAcceptString = this.utilServ.getLangByCode('termsaccept');
      this.termsConditionString = this.utilServ.getLangByCode('termsaccept_1');
      this.termsUsingFeatureString = this.utilServ.getLangByCode('termsaccept_2');
      this.signInString = this.utilServ.getLangByCode('sign_in');
      this.alreadyhaveaccountString = this.utilServ.getLangByCode('alreadyhaveaccount');
      this.noSpaceString = this.utilServ.getLangByCode('no_space');
      this.enterLastNameString = this.utilServ.getLangByCode('enter_last_name');
      this.enterFirstNameString = this.utilServ.getLangByCode('enter_first_name');
      this.emailErrorString = this.utilServ.getLangByCode('email_error1');
      this.enterEmailString = this.utilServ.getLangByCode('enter_email');
      this.enterPasswordString = this.utilServ.getLangByCode('enter_password');
      this.password6charString = this.utilServ.getLangByCode('password_6char');
      this.password30charString = this.utilServ.getLangByCode('password_30char');
      this.PatternDoesNotMatchString = this.utilServ.getLangByCode('PatternDoesNotMatch');
      this.confirmPasswordRequiredString = this.utilServ.getLangByCode('confirm_password_required');
      this.passwordNotMatchString = this.utilServ.getLangByCode('password_not_match');
      this.enterDobString = this.utilServ.getLangByCode('enter_dob');
      this.selectGenderString = this.utilServ.getLangByCode('select_gender');
      this.enterCitySting = this.utilServ.getLangByCode('enter_city');
      this.pleaseSelectCountrySting = this.utilServ.getLangByCode('please_select_country');
      this.exitEmailString = this.utilServ.getLangByCode('exist_email');
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Please try again later',
      buttons: ['OK'],
    });
    await alert.present();
  }
  wishToBeScout(ev) {
    this.willBeScout = Boolean(ev);
    // this.changeTogg += 1;
    if (this.willBeScout === true) {
      this.wantsToBeScoutsDisplayText = this.wantsToBeScoutsString;
      this.toBeScoutValue = 1;
    } else if (this.willBeScout === false) {
      this.wantsToBeScoutsDisplayText = this.neverScoutString;
      this.toBeScoutValue = 0;

    }
    // const age = this.utilServ.getAge(this.userDetail.birthday);
    // if (age < 18 && this.changeTogg > 1) {
    //   this.utilServ.okButtonMessageAlert(this.tobeScoutSelectString);
    //   setTimeout(() => {
    //     this.willBeScout = false;
    //   }, 150);
    //   console.log('A Aa Aaa');
    // }
  }
  // appleLogin(){
  //   const { SignInWithApple } = Plugins;
  //   SignInWithApple.Authorize()
  //     .then(async (res) => {
  //       if (res.response && res.response.identityToken) {
  //         console.log('response from apple:::::::::::', res.response )
  //         // console.log('response from apple:::::::::::', res.response )
  //         this.firstnameModel = res.response.givenName;
  //         this.lastnameModel = res.response.familyName;
  //         this.emailModel = res.response.email;
  //         // this.setImage = res.imageUrl;
  //         // this.externalPic = res.imageUrl;
  //         this.signUpApple = res;
  //         if (this.signUpApple) {
  //         this.hideApple = true;
  //         }
  //       } else {
  //         this.presentAlert();
  //       }
  //     })
  //     .catch((response) => {
  //       this.presentAlert();
  //     });
  // }


  // googleLog() {
  //   this.googleplus.logout();
  //   const params = {
  //     scopes: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/adexchange.buyer',
  //     webClientId: '726234007471-akfpsa0iknsa3j76qj9449lbpr32fnu9.apps.googleusercontent.com',
  //     offline: true
  //   };
  //   this.googleplus.login({ params })
  //     .then((res) => {
  //       this.firstnameModel = res.givenName;
  //       this.lastnameModel = res.familyName;
  //       this.emailModel = res.email;
  //       this.setImage = res.imageUrl;
  //       this.externalPic = res.imageUrl;
  //       this.signUpGoogle = res;

  //       if (this.signUpGoogle) {
  //         // alert('afterlogin' + JSON.stringify(res));
  //         this.hideGoogle = true;
  //       }
  //     }).catch((error) => {
  //       console.log(error);
  //       // console.log(error);
  //       alert('error:' + JSON.stringify(error));
  //     });
  // }
}
