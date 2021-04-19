import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { of } from 'rxjs';
import { SearchInAppComponent } from 'src/app/components/search-in-app/search-in-app.component';


@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.page.html',
  styleUrls: ['./friends-list.page.scss'],
})
export class FriendsListPage implements OnInit {
  // Strings:
  searchString = 'Search';
  friendsString = 'Friends';
  unfriendString = 'Unfriend';
  unfriendConfirmString = 'Are you sure you want to unfriend ';
  cancelString = 'Cancel';
  okayString = 'OK';

  myfrndsList = null;
  userDetail;
  environment;
  searchFriendsTerm = '';
  noFriends = false;
  noFriendString = 'No Friends';
  countryData: any;
  blockAccessGetGuardianString = 'Access is restricted, please get an adult guardian for your account';
  minorData;
  regularUser = false;
  groupsString = 'Groups';
  teamsString = 'Teams';
  eventsString = 'Events';
  editProfileString = 'Edit Profile';
  changeLanguageString = 'Change Language';
  webTrib = false;
  quickInfo: { teams: any; groups: any; friends: any; events: any; };

  constructor(
    private actRouter: ActivatedRoute,
    public socket: Socket,
    private router: Router,
    public alertController: AlertController,
    private platform: Platform,
    private apiService: ApiService,
    private modalcontrolller: ModalController,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.quickInfo = this.utilServ.userQuickInfo();
      this.webTrib = this.platform.is('desktop');

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


      this.myfrndsList = null;
      this.countryData = null;
      let count = 1;
      this.countryData = this.utilServ.getCountryList();
      this.myfrndsList = this.utilServ.friendsList;
      if (this.myfrndsList !== null && this.countryData) {
        this.getCountryNameFromCode();
      }

      const inter = setInterval(() => {
        if (this.myfrndsList === null || this.myfrndsList.length === 0) {
          this.myfrndsList = this.utilServ.friendsList;
          this.countryData = this.utilServ.getCountryList();
          // console.log(this.myfrndsList);
          if (this.myfrndsList !== null) {
            this.getCountryNameFromCode();
          }
          count += 1;
          // console.log(count);
          if (count === 12) {
            clearInterval(inter);
            if (this.myfrndsList === null || this.myfrndsList.length === 0) { this.noFriends = true; }
          }
        } else {
          clearInterval(inter);
        }
      }, 80);
    });
  }
  ngOnInit() {
    this.environment = environment;
  }
  ionViewWillEnter() {
    this.utilServ.checkUserExists();
    if (this.utilServ.friendsList === null) {
      const initFrnd = setInterval(() => {
        this.utilServ.userAddonDetails();
        if (this.utilServ.friendsList !== null) {
          clearInterval(initFrnd);
        }
      }, 200);
    }
  }
  async unFriend(frndId, frndName) {
    const confirm = await this.alertController.create({
      header: this.unfriendString + '?',
      // message: this.unfriendConfirmString.replace('%X', frndName),
      message: this.unfriendConfirmString + frndName + '?',
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel'
        },
        {
          text: this.okayString,
          handler: () => {
            const data = {
              cf_id: frndId,
              hf_id: this.userDetail.id
            };
            this.socket.connect();
            this.socket.emit('cancel-friend-request', data);
            // this.myfrndsList = '';
            this.utilServ.friendsList = null;
            this.utilServ.userAddonDetails();
            this.ionViewWillEnter();
            this.myfrndsList = this.utilServ.friendsList;
          }
        }
      ]
    });
    confirm.present();
    confirm.onDidDismiss().then(x => {
      let count = 1;

      const inter = setInterval(() => {
        if (this.myfrndsList === null || this.myfrndsList.length === 0) {
          this.myfrndsList = this.utilServ.friendsList;
          count += 1;
          if (count === 12) {
            clearInterval(inter);
            if (this.myfrndsList === null || this.myfrndsList.length === 0) { this.noFriends = true; }
          }
        } else {
          clearInterval(inter);
        }
      }, 80);
    });
  }
  rootMsgPage(friendId) {
    this.utilServ.navChatwithId(friendId);
  }
  goToProfile(id) {
    this.router.navigate([`profile/${id}`]);
  }
  getCountryNameFromCode() {
    this.myfrndsList.forEach(element => {
      const xDx = this.countryData.filter(d => d.CC_ISO === element.country_code);
      if (xDx[0]) {
        element.country = xDx[0].COUNTRY_NAME;
      }
    });
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.noFriendString = this.utilServ.getLangByCode('no_frnd_list');
      this.searchString = this.utilServ.getLangByCode('search');
      this.friendsString = this.utilServ.getLangByCode('friends');
      this.unfriendString = this.utilServ.getLangByCode('unfriend');
      this.unfriendConfirmString = this.utilServ.getLangByCode('unfriendConfirmString').replace(/%X/gi, '').replace('?', '');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.okayString = this.utilServ.getLangByCode('okay');
      this.blockAccessGetGuardianString = this.utilServ.getLangByCode('minor.noGuardian.message');
      this.groupsString = this.utilServ.getLangByCode('groups');
      this.eventsString = this.utilServ.getLangByCode('events');
      this.changeLanguageString = this.utilServ.getLangByCode('language');
      this.editProfileString = this.utilServ.getLangByCode('edit_profile');
      this.teamsString = this.utilServ.getLangByCode('team');
    }
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

}
