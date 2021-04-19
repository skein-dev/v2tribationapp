import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.page.html',
  styleUrls: ['./forget-pass.page.scss'],
})
export class ForgetPassPage implements OnInit {
  email;
  forgotPass: FormGroup;

  // String
  forgotPassString = 'Forgot Password';
  emaiLString = 'Email';
  sendString = 'Send';
  enterEmail = 'Enter Email';
  notValidEmail = 'Email Not Valid';
  loginString = 'Login';
  successEmailSentString = 'Please check your email to reset your password.';
  errorEmailSentString = 'Failed to send email! Please retry.';
  enterEmailToResetString = 'Enter your email address below to reset password';

  constructor(
    private utilServ: GenralUtilsService,
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
  ) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
    this.createform();
  }
  private createform() {
    this.forgotPass = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@'
        + '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])
    });
  }
  sendEmail() {
    this.apiService.forgetPassword(this.forgotPass.value.email).subscribe((res: any) => {
      // console.log(res);
      if (res.success === 1) {
        this.utilServ.okButtonMessageAlert(this.successEmailSentString);
        this.backtologin();
      } else {
        this.utilServ.okButtonMessageAlert(this.errorEmailSentString);
      }
    });
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }
  backtologin() {
    this.utilServ.navLogin();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.forgotPassString = this.utilServ.getLangByCode('forgotpassword');
      this.emaiLString = this.utilServ.getLangByCode('email');
      this.sendString = this.utilServ.getLangByCode('send');
      this.enterEmail = this.utilServ.getLangByCode('enter_email');
      this.notValidEmail = this.utilServ.getLangByCode('not_valid_email');
      this.loginString = this.utilServ.getLangByCode('sign_in');
      this.successEmailSentString = this.utilServ.getLangByCode('forgot_content_success');
      this.errorEmailSentString = this.utilServ.getLangByCode('forgot_content_error');
      this.enterEmailToResetString = this.utilServ.getLangByCode('find_your_email');
    }
  }
}
