import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {
  userDetail;
  accessGained = false;
  submitBtton = true;
  noMatch;
  password: string;
  profileCity;
  profileFirstname;
  profileLastName;
  profileEmailId;
  environment;
  profileId;
  profileImageURL;

  passwordString = 'Enter Password';
  submitString = 'Submit';
  deleteAccString = 'Delete Account';
  confirmDeleteString = 'Confirm delete account';
  deactivateAccString = 'Deactivate Account';
  enterPasswordString = 'For security reasons, please enter your password';
  accountdeletedString = 'Your Account has been deactivated';
  deleteAccmessageString = 'The account will be deactivated for 30 days.';
  passwordNotVerifyString = 'Could not verify your password';
  constructor(
    private socket: Socket,
    private apiService: ApiService,
    private location: Location,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.accessGained = false;
      this.noMatch = false;
      this.submitBtton = true;
      this.password = '';
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.profileCity = this.userDetail.city;
      this.profileFirstname = this.userDetail.first_name;
      this.profileLastName = this.userDetail.last_name;
      this.profileEmailId = this.userDetail.email;
      this.profileId = this.userDetail.id;
      this.profileImageURL = this.userDetail.profile_img_url;
    });
  }

  ngOnInit() {
    this.environment = environment;
  }
  ionViewWillEnter() {
    this.utilServ.checkUserExists();
  }
  passwordEntered() {
    this.noMatch = false;
    if (this.password.length > 5 && this.password.length < 31) {
      this.submitBtton = false;
    } else {
      this.submitBtton = true;
    }
  }
  verifyPass() {
    this.apiService.verifyPassword(this.userDetail.id, this.password).subscribe((res: any) => {
      if (res.message === true) {
        this.accessGained = res.message;
      } else if (res.message === false) {
        this.noMatch = true;
        this.accessGained = res.message;
      }
    });
  }
  deleteUsr() {
    this.apiService.deleteUser(this.userDetail.id).subscribe((res: any) => {
      if (res.success === 1) {
        this.utilServ.presentToast(this.accountdeletedString);
        setTimeout(() => {
          this.doReset();
        }, 150);
      }
    });
  }
  doReset() {
    this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
    this.socket.emit('socketDisconnect', { id: this.userDetail.tokenid });
    const tokenlog = JSON.parse(localStorage.getItem('userdetail'));
    this.apiService.logout(tokenlog.token).subscribe((res: any) => {
      localStorage.clear();
      this.utilServ.resetDefaults();
      this.utilServ.setIntroStatus(1);
      localStorage.setItem('firstTime', 'true');
      this.utilServ.navLogin();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  }

  back() {
    this.location.back();
  }
}

