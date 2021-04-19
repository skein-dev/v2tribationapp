import { Component, OnInit, ViewChild } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { IonSelect } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-privacy-setting',
  templateUrl: './privacy-setting.page.html',
  styleUrls: ['./privacy-setting.page.scss'],
})
export class PrivacySettingPage implements OnInit {
  @ViewChild('canViewProfileTag') canViewProfileTag: IonSelect;
  @ViewChild('canCommentPostsTag') canCommentPostsTag: IonSelect;
  @ViewChild('canSeeFriendsListTag') canSeeFriendsListTag: IonSelect;
  @ViewChild('canseefollowerslistTag') canseefollowerslistTag: IonSelect;
  @ViewChild('cansendfriendreqTag') cansendfriendreqTag: IonSelect;
  @ViewChild('scoutTag') wishTobeScoutTag: IonSelect;

  canViewProfileShow = true;
  canCommentPostsShow = true;
  cansendfriendreqShow = true;
  canseefollowerslistShow = true;
  canSeeFriendsListShow = true;

  // Strings
  privacySettingsString = 'Privacy Settings';
  anyoneString = 'Anyone';
  fansString = 'Fans';
  friendsOfFriendsString = 'Friends of Friends';
  friendsString = 'Friends';
  noOneString = 'No One';
  saveString = 'Save';
  canViewProfileString = 'can view my profile';
  canCommentPostsString = 'can comment on my posts';
  canSeeFriendsListString = 'can see my friends list';
  canseefollowerslistString = 'can see my followers list';
  cansendfriendreqString = 'can send me friend request';
  newsletterAcceptString = 'Subscribe to the newsletter';
  unsubcribeNewsletterString = 'Unsbscribe to the newsletter';
  changesHaveBeenSavedString = 'Your Changes have been Saved';
  wantsToBeScoutsString = 'Wish to be a scouted';
  neverScoutString = 'Don\'t want to be a scouted';
  tobeScoutSelectString = ' Please add a Guardian to become visible to scouts';

  canViewProfileDisplayText;
  canCommentPostsDisplayText;
  canSeeFriendsListDisplayText;
  canseefollowerslistDisplayText;
  cansendfriendreqDisplayText;
  wantsToBeScoutsDisplayText;

  userDetail;
  newsletterModel;
  canViewProfileModel;
  canCommentPostsModel;
  cansendfriendreqModel;
  canseefollowerslistModel;
  canSeeFriendsListModel;
  goodToGo = false;
  changeTogg = 0;
  // Not in use eith UI but required
  tempToBeChange: any;
  willBeScout: any;
  deleteAccString = 'Delete Account';

  constructor(
    private location: Location,
    private actRouter: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private utilServ: GenralUtilsService,) {
    this.actRouter.queryParams.subscribe(() => {
      this.setUpBasicDetails();
      this.utilServ.hideLoaderWaitAMin();
    });


  }

  ngOnInit() {
    // this.setUpBasicDetails();
  }

  ionViewWillEnter() {
    this.utilServ.checkUserExists();
    // setTimeout(() => {
    //   this.utilServ.hideLoaderWait();        
    //   this.utilServ.hideLoaderWaitAMin();        
    //   this.utilServ.hideLoaderWaitAMin();        
    // }, 1500);
  }
  setUpBasicDetails() {
    if (this.goodToGo === false) {
      // console.log('showingLoader');
      this.utilServ.showLoaderWait();
    }
    if (this.utilServ.langLibrary) {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      if (this.utilServ.langSetupFLag) {
        this.privacySettingsString = this.utilServ.getLangByCode('privacy_settings');
        this.anyoneString = this.utilServ.getLangByCode('anyone');
        this.fansString = this.utilServ.getLangByCode('fans');
        this.friendsOfFriendsString = this.utilServ.getLangByCode('friends_friends');
        this.friendsString = this.utilServ.getLangByCode('friends');
        this.noOneString = this.utilServ.getLangByCode('noone');
        this.saveString = this.utilServ.getLangByCode('save');
        this.canViewProfileString = this.utilServ.getLangByCode('can_view_profile');
        this.canCommentPostsString = this.utilServ.getLangByCode('can_comment_posts');
        this.canSeeFriendsListString = this.utilServ.getLangByCode('can_see_friends_list');
        this.canseefollowerslistString = this.utilServ.getLangByCode('can_see_followers_list');
        this.cansendfriendreqString = this.utilServ.getLangByCode('can_send_friendreq');
        this.newsletterAcceptString = this.utilServ.getLangByCode('newsletter_accept');
        this.unsubcribeNewsletterString = this.utilServ.getLangByCode('newsletter_disable');
        this.wantsToBeScoutsString = this.utilServ.getLangByCode('be_scout');
        this.neverScoutString = this.utilServ.getLangByCode('never_scout');
        // this.tobeScoutSelectString = this.utilServ.getLangByCode('');
      }
      //  else {
      //   this.utilServ.checkBasicElseRelodApp();
      // }
      this.apiService.privacySettingData(this.userDetail.id).subscribe((res: any) => {
        if (res.success === 1 && res.message) {
          // console.log(res.message);
          this.privacySettingApi(res.message[0]);
        }
      });
      if (this.privacySettingApi) {
        this.utilServ.hideLoaderWaitAMin();
        this.utilServ.hideLoaderWait();
        setTimeout(() => {
          this.utilServ.hideLoaderWait();
          this.utilServ.hideLoaderWaitAMin();
          this.utilServ.hideLoaderWaitAMin();
        }, 4500);
      }
    }
    this.utilServ.hideLoaderWaitAMin();

  }
  privacySettingApi(apiData) {
    this.utilServ.hideLoaderWait();
    this.newsletterModel = String(apiData.newsletter);
    this.canCommentPostsModel = apiData.who_comment_post;
    this.cansendfriendreqModel = apiData.who_request_friend;
    this.canseefollowerslistModel = apiData.who_see_followers;
    this.canSeeFriendsListModel = apiData.who_see_friends;
    this.canViewProfileModel = apiData.who_view_profile;
    this.tempToBeChange = apiData.who_comment_profile;
    this.willBeScout = apiData.will_be_scout;

    this.canViewProfileChange(this.canViewProfileModel);
    this.canCommentPostsChange(this.canCommentPostsModel);
    this.cansendfriendreqChange(this.cansendfriendreqModel);
    this.canseefollowerslistChange(this.canseefollowerslistModel);
    this.canSeeFriendsListChange(this.canSeeFriendsListModel);
    this.wishToBeScout(this.willBeScout);
    this.goodToGo = true;
    if (this.goodToGo === true) {
      this.utilServ.hideLoaderWait();
      this.utilServ.hideLoaderWaitAMin();
      setTimeout(() => {
        this.utilServ.hideLoaderWait();
        this.utilServ.hideLoaderWaitAMin();
        this.utilServ.hideLoaderWaitAMin();
      }, 4500);
    }
    // console.log(apiData);
    // apiData.scout_status;
    setTimeout(() => {
      this.utilServ.hideLoaderWait();
      this.utilServ.hideLoaderWaitAMin();
      this.utilServ.hideLoaderWaitAMin();
    }, 4500);
  }

  canViewProfile(ev) {
    this.canViewProfileTag.open(ev);
  }
  canViewProfileChange(x) {
    if (x === 'anyone') {
      this.canViewProfileDisplayText = this.canViewProfileString.replace('%X', this.anyoneString);
    } else if (x === 'fans') {
      this.canViewProfileDisplayText = this.canViewProfileString.replace('%X', this.fansString);
    } else if (x === 'friends') {
      this.canViewProfileDisplayText = this.canViewProfileString.replace('%X', this.friendsString);
    } else if (x === 'friends of friends') {
      this.canViewProfileDisplayText = this.canViewProfileString.replace('%X', this.friendsOfFriendsString);
    }
  }

  canCommentPosts(ev) {
    this.canCommentPostsTag.open(ev);
  }
  canCommentPostsChange(x) {
    if (x === 'anyone') {
      this.canCommentPostsDisplayText = this.canCommentPostsString.replace('%X', this.anyoneString);
    } else if (x === 'fans') {
      this.canCommentPostsDisplayText = this.canCommentPostsString.replace('%X', this.fansString);
    } else if (x === 'friends') {
      this.canCommentPostsDisplayText = this.canCommentPostsString.replace('%X', this.friendsString);
    } else if (x === 'friends of friends') {
      this.canCommentPostsDisplayText = this.canCommentPostsString.replace('%X', this.friendsOfFriendsString);
    }
  }
  wishToBeScout(ev) {
    this.willBeScout = Boolean(ev);
    // this.changeTogg += 1;
    if (this.willBeScout === true) {
      this.wantsToBeScoutsDisplayText = this.wantsToBeScoutsString;
    } else if (this.willBeScout === false) {
      this.wantsToBeScoutsDisplayText = this.neverScoutString;
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

  cansendfriendreq(ev) {
    this.cansendfriendreqTag.open(ev);
  }
  cansendfriendreqChange(x) {
    // console.log(x);
    if (x === 'anyone') {
      this.cansendfriendreqDisplayText = this.cansendfriendreqString.replace('%X', this.anyoneString);
    } else if (x === 'no one') {
      this.cansendfriendreqDisplayText = this.cansendfriendreqString.replace('%X', this.noOneString);
    } else if (x === 'friends of friends') {
      this.cansendfriendreqDisplayText = this.cansendfriendreqString.replace('%X', this.friendsOfFriendsString);
    }
  }

  canseefollowerslist(ev) {
    this.canseefollowerslistTag.open(ev);
  }
  canseefollowerslistChange(x) {
    if (x === 'anyone') {
      this.canseefollowerslistDisplayText = this.canseefollowerslistString.replace('%X', this.anyoneString);
    } else if (x === 'fans') {
      this.canseefollowerslistDisplayText = this.canseefollowerslistString.replace('%X', this.fansString);
    } else if (x === 'friends') {
      this.canseefollowerslistDisplayText = this.canseefollowerslistString.replace('%X', this.friendsString);
    } else if (x === 'friends of friends') {
      this.canseefollowerslistDisplayText = this.canseefollowerslistString.replace('%X', this.friendsOfFriendsString);
    }
  }

  canSeeFriendsList(ev) {
    this.canSeeFriendsListTag.open(ev);
  }
  canSeeFriendsListChange(x) {
    if (x === 'anyone') {
      this.canSeeFriendsListDisplayText = this.canSeeFriendsListString.replace('%X', this.anyoneString);
    } else if (x === 'fans') {
      this.canSeeFriendsListDisplayText = this.canSeeFriendsListString.replace('%X', this.fansString);
    } else if (x === 'friends') {
      this.canSeeFriendsListDisplayText = this.canSeeFriendsListString.replace('%X', this.friendsString);
    } else if (x === 'friends of friends') {
      this.canSeeFriendsListDisplayText = this.canSeeFriendsListString.replace('%X', this.friendsOfFriendsString);
    }
  }


  save() {
    const tempDataToSend = {
      newsletter: this.newsletterModel,
      who_comment_post: this.canCommentPostsModel,
      who_comment_profile: this.tempToBeChange,
      who_request_friend: this.cansendfriendreqModel,
      who_see_followers: this.canseefollowerslistModel,
      who_see_friends: this.canSeeFriendsListModel,
      who_view_profile: this.canViewProfileModel,
      will_be_scout: this.willBeScout,
    };
    this.apiService.updatePrivacySetting(this.userDetail.id, tempDataToSend).subscribe((res: any) => {
      // console.log(res);
    });
    this.utilServ.okButtonMessageAlert(this.changesHaveBeenSavedString);

    setTimeout(() => {
      this.back();
    }, 1700);
  }

  back() {
    this.location.back();
  }
  deleteUser() {
    this.router.navigate(['/delete-account']);
  }
}
