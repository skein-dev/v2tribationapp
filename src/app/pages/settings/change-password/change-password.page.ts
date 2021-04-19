import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

const trimValidator: ValidatorFn = (control: FormControl) => {
  if (control.value) {
    if (control.value.startsWith(' ')) {
      return {
        'trimError': { value: 'control has leading whitespace' }
      };
    }
    return null;
  }
};


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePass: FormGroup;


  // Basic User Details
  userDetail;
  profileImageURL;
  profileFirstname;
  profileLastName;
  profilePicUrl;
  profileId;
  profileEmailId;
  profileCity;
  environment;


  currentPassword;
  confirmPassword;
  newPassword;

  // Strings
  changePasswordString = 'Change Password';
  newPasswordString = 'New Password';
  currentPasswordString = 'Current Password';
  confirmPasswordString = 'Confirm Password';
  updateSting = 'Update';
  noSpaceErrorString = 'No Leading white spaces';
  pleaseEnterCorrectPassString = 'Please Enter Correct Password';
  PatternDoesNotMatchString = 'Must fullfill 3 of following 4 : UpperCase,lowercase,Number & SpecialCharter';
  maxLengthErrorString = 'Maximum 30 Charecters';
  minLengthErrorString = 'Minimum 6 Charecters';
  passwordDoesNotMatchString = 'Password Does\'t Match';
  incorrectPasswordString = 'Incorrect Password';
  passwordChangedString = 'Password has been changed';
  constructor(
    private location: Location,
    // private loadingController: LoadingController,
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.setupBasicDetails();
    });
  }

  ngOnInit() {
    this.passform();
    this.environment = environment;
    this.setupBasicDetails();
  }

  ionViewWillEnter() {
    this.utilServ.setUpUser();
  }

  private passform() {
    this.changePass = new FormGroup({
      currentPasswordControl: new FormControl('',
        [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
          trimValidator]),
      newPasswordControl: new FormControl('', Validators.compose(
        [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
          trimValidator,
        Validators.pattern(/(?=^.{6,30}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/)])),
      confirmPasswordControl: new FormControl('', Validators.compose(
        [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
          trimValidator,
        Validators.pattern(/(?=^.{6,30}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/),
        this.equalto('newPasswordControl')])),
    });
  }
  equalto(fieldName): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const input = control.value;
      const isValid = control.root.value[fieldName] === input;
      if (!isValid) {
        return { 'equalTo': { isValid } };
      } else {
        return null;
      }
    };
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.utilServ.okButtonMessageAlert(this.pleaseEnterCorrectPassString);
    } else {
      this.apiService.changePassword(this.userDetail.id, this.currentPassword, this.newPassword).pipe().subscribe((res: any) => {
        if (res.success === 0) {
          this.utilServ.okButtonMessageAlert(this.incorrectPasswordString);
        } else if (res.success === 1) {
          this.changePass.reset();
          this.utilServ.okButtonMessageAlert(this.passwordChangedString);
          this.back();
        }
      }),
        error => { console.log(error); }
    }
  }

  setupBasicDetails() {
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.utilServ.checkUserExists();
    this.profileId = this.userDetail.id;
    this.profileImageURL = this.userDetail.profile_img_url;
    this.profileFirstname = this.userDetail.first_name;
    this.profileLastName = this.userDetail.last_name;
    this.profileCity = this.userDetail.city;
    this.profileEmailId = this.userDetail.email;
    if (!this.userDetail) {
      this.utilServ.navLogin();
    }
    if (this.utilServ.langSetupFLag) {
      this.changePasswordString = this.utilServ.getLangByCode('change_password');
      this.newPasswordString = this.utilServ.getLangByCode('new_password');
      this.currentPasswordString = this.utilServ.getLangByCode('current_password');
      this.confirmPasswordString = this.utilServ.getLangByCode('confirm_password');
      this.updateSting = this.utilServ.getLangByCode('update');
      this.noSpaceErrorString = this.utilServ.getLangByCode('no_space');
      this.pleaseEnterCorrectPassString = this.utilServ.getLangByCode('please_enter_correct_pass');
      this.PatternDoesNotMatchString = this.utilServ.getLangByCode('PatternDoesNotMatch');
      this.maxLengthErrorString = this.utilServ.getLangByCode('password_30char');
      this.minLengthErrorString = this.utilServ.getLangByCode('password_6char');
      this.passwordDoesNotMatchString = this.utilServ.getLangByCode('password_not_match');
      this.incorrectPasswordString = this.utilServ.getLangByCode('Incorr_Pass');
      this.passwordChangedString = this.utilServ.getLangByCode('pass_has_been_change');
    } else {
      this.utilServ.checkBasicElseRelodApp();
      window.location.reload();
    }
  }

  back() {
    this.location.back();
  }
}
