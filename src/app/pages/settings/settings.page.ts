import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { ResponseSignInWithApplePlugin } from '@capacitor-community/apple-sign-in';
// const { SignInWithApple } = Plugins;
// import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
// import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase';
// import { GoogleAuthPlugin } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userDetail;
  resultGoogle;
  // Strings
  settingsString = 'Settings';
  accountString = 'Account';
  aboutString = 'About';
  editProfileString = 'Edit Profile';
  privacySecurityString = 'Privacy Security';
  changePasswordString = 'Change Password';
  languageString = 'Language';
  notificationsString = 'Notification';
  helpCenterString = 'Help Center';
  reportProblemString = 'Report a Problem';
  notAbleToEditAsScoutString = 'Please contact Tribation to edit your profile';
  aboutTribationString = 'About Tribation'

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    // private googleAuth:GoogleAuthPlugin,
    // private signInWithApple: SignInWithApple,
    // private firebaseAuthentication: FirebaseAuthentication,
    // private fireAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      if (this.utilServ.langSetupFLag) {
        this.localLang();
      }
    });
  }

  ngOnInit() {

  }
  google() {
    // cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.726234007471-ofq0cppj6ovdelped9gitkj0gkkfgpdu --variable WEB_APPLICATION_CLIENT_ID=726234007471-akfpsa0iknsa3j76qj9449lbpr32fnu9.apps.googleusercontent.com
    const params = {
      // webClientId: '47460128769-61ombklis311ts4r3eb9o35e2fv55u37.apps.googleusercontent.com',
      // scopes: 'https://www.googleapis.com/auth/admin.directory.customer.read only',
      // scopes: 'https://www.googleapis.com/auth/admin.directory.user.readonly',
      // scopes: 'https://www.googleapis.com/auth/adexchange.buyer',
      // scopes: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/adexchange.buyer',
      webClientId: '726234007471-akfpsa0iknsa3j76qj9449lbpr32fnu9.apps.googleusercontent.com',
      offline: true
    };
    this.googlePlus.login({ params })
      .then((res) => {
        alert('afterlogin' + JSON.stringify(res));

      }).catch((error) => {
        // console.log(error);
        alert('error:' + JSON.stringify(error));
      });

    // }
    // onLoginSuccess(accessToken, accessSecret) {
    //   const credential = accessSecret ? firebase.auth.GoogleAuthProvider
    //     .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
    //       .credential(accessToken);
    //   this.fireAuth.signInWithCredential(credential)
    //     .then((response) => {
    //       console.log('response', response);
    //       // this.router.navigate(["/profile"]);
    //       // this.loading.dismiss();
    //     });

    // }
    // onLoginError(err) {
    //   console.log(err);
    // }
    // async apple() {
    //   this.signInWithApple.signin({
    //     requestedScopes: [
    //       ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
    //       ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
    //     ]
    //   })
    //     .then((res: AppleSignInResponse) => {
    //       // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
    //       alert('Send token to apple for verification: ' + JSON.stringify(res));
    //       console.log(res);
    //     })
    //     .catch((error: AppleSignInErrorResponse) => {
    //       alert(error.code + ' ' + JSON.stringify(error));
    //       console.error(error);
    //     });
    //   // const response: ResponseSignInWithApplePlugin = await SignInWithApple.Authorize();
    //   // console.log('AppleSign:: ', response);
    //   // alert('AppleSign::' + JSON.stringify(response));
  }

  ionViewWillEnter() {
    this.utilServ.checkUserExists();
    this.actRouter.queryParams.subscribe(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      if (this.utilServ.langSetupFLag) {
        this.localLang();
      }
    });
  }
  localLang() {
    this.settingsString = this.utilServ.getLangByCode('settings');
    this.accountString = this.utilServ.getLangByCode('account');
    this.aboutString = this.utilServ.getLangByCode('about');
    this.editProfileString = this.utilServ.getLangByCode('edit_profile');
    this.privacySecurityString = this.utilServ.getLangByCode('privacy_security');
    this.changePasswordString = this.utilServ.getLangByCode('change_password');
    this.languageString = this.utilServ.getLangByCode('language');
    this.notificationsString = this.utilServ.getLangByCode('notifications');
    this.helpCenterString = this.utilServ.getLangByCode('help_center');    // needTosee - string is not proper
    this.reportProblemString = this.utilServ.getLangByCode('report_problem');
    this.notAbleToEditAsScoutString = this.utilServ.getLangByCode('notAbleToEditAsScoutString');
  }
  scoutCantEdit() {
    this.utilServ.presentToast(this.notAbleToEditAsScoutString);
  }
  aboutTribation() {
    this.router.navigate(['/intro']);
  }

}
