import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ProfilePortfolioComponent } from 'src/app/components/profile-portfolio/profile-portfolio.component';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { MultimediaViewComponent } from 'src/app/components/multimedia-view/multimedia-view.component';
import { CommentOnPostComponent } from 'src/app/components/comment-on-post/comment-on-post.component';
import { Socket } from 'ngx-socket-io';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { EditPostComponent } from 'src/app/components/edit-post/edit-post.component';
import { GuardianTermsComponent } from 'src/app/components/guardian-terms/guardian-terms.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('contentMain') contentForScroll: any;

  environment;
  profile: any;
  profileId;
  coverUrl = '../../../assets/tribation.jpg';
  currentLocation: string;
  userProfileDetail: any = null;
  totoalPost: any;
  postsArray: any[] = [];
  userDetail;
  checkedSegment;
  personalMedia: any[] = [];
  totalPersonalMedia: any;
  friendsList: any[];
  myfrndsList: any[];
  scoutVisting = false;
  limitReached = false;
  unfriend = false;
  cancelRequest = false;
  sendRequest = false;
  showGoTop = false;
  userStatus: any;
  isAthlet = false;
  isMinor = false;
  sendGuardRequest = false;
  cancelSentGuardreq = false;

  userProfileData: any = {};
  coverBg = false;
  userProfileInfo: any = {
    baseInfo: '',
    extraInfo: '',
  };
  profilepicUrl: any = '';
  countryList;
  noFriends = false;
  searchFriendsTerm = '';
  acceptRejAction: any;
  data: any;
  called = false;


  // Strings
  postString = 'Post';
  sharedString = 'Shared';
  portfolioString = 'Portfolio'; //changed
  mediaString = 'Media';
  homeString = 'Home';
  friendsString = 'Friends';
  someonesPostString = '\'s post';
  unfriendString = 'Unfriend';
  friendRequestSentString = 'Friend request sent';
  unfriendConfirmString = 'Are you sure you want to unfriend ';
  cancelReqConfirmString = 'Are you sure you want to cancel friend request';
  cancelString = 'Cancel';
  okayString = 'OK';
  requestedString = 'Requested';
  addFriendString = 'Friends';
  editString = 'Edit';
  deleteString = 'Delete';
  reportString = 'Report';
  noPostString = 'No post\'s to show create a post and share with your friends';
  noFriendString = 'No Friends';
  noMediaString = 'No Media Available';
  alreadySharedString = 'Already Shared';
  sharedPostString = 'Post has been shared.';
  searchString = 'Search';
  acceptRequestString = 'Confirm Request';
  deleteRequestString = 'Delete Request';
  acceptFrndReqString = 'Are you sure you want to accept friend request?';
  deleteFrndReqString = 'Are you sure you want to reject the friend request?';
  enterReasonString = 'Please type your reason for reporting';
  reasonToReportString = 'Write your reason here';
  reportSubmittedString = 'Report has been submitted';
  viewCoverString = 'View Cover';
  reportUserString = 'Report User';
  changeCoverString = 'Change Cover';
  getingFeedString = 'Getting Feeds';
  noFriendpostString = 'Has not shared anything yet.';
  shareString = 'Are you sure you want to share this post?';
  addAsGuardianString = 'Guardian Request';
  cancelGuardReqString = 'cancel Guardian request';
  cancelGuardReqLinkString = 'Cancel Link';
  sureDeleteString = 're you sure you want to delete this post?';
  yesString = 'Yes';
  messageString = 'Message';
  isGuardian = false;
  guardianMinorFlag = false;
  acceptRejGuardAction = false;
  cancelGuardianMinorLink = false;
  chatStatus = false;

  constructor(
    private location: Location,
    private actRouter: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    public nativeLib: DeviceNativeApiService,
    public socketAPI: Socket,
    private router: Router,
    private modalcontrolller: ModalController,
    private actionSheetController: ActionSheetController,
    private element: ElementRef,
    private modalController: ModalController,
    private apiService: ApiService,
    private eventCustom: EventsCustomService,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      // this.getProfileDataOfUser();
      this.countryList = this.utilServ.getCountryList();
      this.utilServ.getMyMinors(this.userDetail.id);
      this.utilServ.getUserStatus(this.userDetail.id);
      this.socketAPI.on('accept-friend', (res) => {
        this.utilServ.userAddonDetails();
        this.utilServ.friendsList = null;
        this.utilServ.userAddonDetails();
        this.getProfileDataOfUser();
      });
      this.getLanguageStrings();
      this.getUserStatus();
      this.socketAPI.on('guardian-accept-request', (res) => {
        // alert("accept");
        this.getProfileDataOfUser();
      });
      this.socketAPI.on('guardian-receive-request', (res) => {
        // alert("rcv");
        this.getProfileDataOfUser();
      });
      this.socketAPI.on('guardian-cancel-link', (res) => {
        this.getProfileDataOfUser();
        // alert("cancel link");
      });
      this.socketAPI.on('guardian-reject-request', (res) => {
        this.getProfileDataOfUser();
        // alert("reject");
      });
      this.socketAPI.on('guardian-cancel-request', (res) => {
        this.getProfileDataOfUser();
        // alert("cancel req ");
      });
    });
  }

  ngOnInit() {
    this.environment = environment;
    // console.log("+++++", JSON.parse(localStorage.getItem("online")))
    this.chatStatus = JSON.parse(localStorage.getItem("online"));
  }

  ionViewWillEnter() {
    this.checkedSegment = 'home';
    this.utilServ.checkUserExists();
    this.currentLocation = JSON.parse(localStorage.getItem('currentLocation'));
    const x: string = this.currentLocation.substr(9, this.currentLocation.length);
    this.profileId = Number(x.split('/')[0]);
    if (x.split('/')[1] === 'portfolio') {
      this.scoutVisting = true;
      this.openProtfolio();
    }
    this.loadPost();
    this.getProfileDataOfUser();
    setTimeout(() => {
      if (this.userProfileDetail.country_code !== '0' && this.countryList) {
        const xDx = this.countryList.filter(d => d.CC_ISO === this.userProfileDetail.country_code);
        if (xDx[0]) {
          this.userProfileDetail.countryName = xDx[0].COUNTRY_NAME;
        }
      }
    }, 800);
  }

  logScrolling(event) {
    if (event.detail.scrollTop >= 836) {
      this.showGoTop = true;
    } else {
      this.showGoTop = false;
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.postsArray = [];
      this.loadPost();
      event.target.complete();
    }, 1200);

  }
  loadMorePost(eve) {
    if (this.postsArray.length === this.totoalPost) {
      this.limitReached = true;
    } else {
      this.loadPost();
    }
    setTimeout(() => {
      eve.target.complete();
    }, 1000);
  }

  loadPost() {
    let offset = 0;
    if (this.postsArray.length !== 0) {
      offset = this.postsArray.length;
    }
    if (offset === this.totoalPost) {
      this.limitReached = true;
    }
    this.apiService.getUserProfilePageData(15, offset, Number(this.profileId), this.userDetail.id).subscribe((res: any) => {
      this.userProfileDetail = res.message.user;
      this.userProfileDetail.countryName = '';
      if (this.userProfileDetail.profile_bg_img_url !== '') {
        this.coverUrl = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=profile/${this.profileId}/${this.userProfileDetail.profile_bg_img_url}`;
        this.coverBg = true;
      }
      if (this.userProfileDetail.profile_img_url !== '') {
        this.profilepicUrl = `${this.userProfileDetail.profile_img_url}`;
      }

      if (!this.totoalPost) { this.totoalPost = res.message.meta.total; }
      if (this.postsArray.length === 0) {
        this.postsArray = res.message.content;
      } else {
        if (this.postsArray.length === this.totoalPost) {
          this.limitReached = true;
        } else {
          res.message.content.forEach(post => {

            this.postsArray.push(post);
          });
        }
      }
      this.dontReloadMension();
    });
  }

  likePost(postId, xx, postUser) {
    if (this.postsArray[xx].liked === 1) {
      this.postsArray[xx].liked = 0;
      this.postsArray[xx].likes -= 1;
      this.apiService.unLikePost(this.userDetail.id, postId).subscribe((lyk: any) => {
        // console.log(lyk);
      });
    } else {
      this.postsArray[xx].liked = 1;
      this.postsArray[xx].likes += 1;
      this.apiService.likePost(this.userDetail.id, postId).subscribe((lyk: any) => {
        if (lyk.success === 1) {
          const likedata = {
            user_id: this.userDetail.id,
            poster_id: postUser
          };
          this.socketAPI.emit('like-event', likedata);
        }
      });
    }
  }

  async sharePost(post, xx) {
    const alert = await this.alertController.create({
      message: this.shareString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: this.okayString,
          handler: () => {
            const postId = post.id;
            if (this.postsArray[xx].youShared === 0) {
              this.apiService.sharePost(this.userDetail.id, postId).subscribe((shre: any) => {
                if (shre.message === 'Already Shared') {
                  this.utilServ.presentToast(this.alreadySharedString);
                } else if (shre.success === 1) {
                  this.postsArray[xx].youShared = 1;
                  const shareData = { user_id: this.userDetail.id, poster_id: postId };
                  this.postsArray[xx].shares += 1;
                  this.socketAPI.emit('share-event', shareData);
                  this.utilServ.presentToast(this.sharedPostString);
                }
              });
            } else {
              this.utilServ.presentToast(this.alreadySharedString);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async commentPost(feed, xx) {
    // console.log(this.postsArray[xx].comments);
    const feedDataComment = {
      postId: feed.id,
      userId: feed.user.id
    };
    localStorage.setItem('commentOnPost', JSON.stringify(feedDataComment));
    const modal = await this.modalController.create({
      component: CommentOnPostComponent,
      cssClass: 'comment_of_post',
    });
    modal.onDidDismiss().then((commentRes) => {
      localStorage.removeItem('commentOnPost');
      this.apiService.getsharelikecommentpost(this.userDetail.id, feed.id).subscribe((commentRes: any) => {
        const cmnt = commentRes.message.commentData.comments;
        this.postsArray[xx].comments = cmnt.length;
        cmnt.forEach(ele => {
          if (ele.user.id === this.userDetail.id) {
            this.postsArray[xx].commented = 1;
          }
        });
      });

      const ttl = this.postsArray[xx].comments + commentRes.data.data.comment + commentRes.data.data.reply;

      if (ttl > 0) {
        this.postsArray[xx].commented = 1;
      }
    });
    return await modal.present();
  }
  private dontReloadMension(): void {
    setTimeout(() => {
      const urls: any = this.element.nativeElement.querySelectorAll('a');
      urls.forEach((url) => {
        url.addEventListener('click', (event) => {
          event.preventDefault();
          const textOfLink = event.target.innerText;
          // console.log(textOfLink);
          const x = event.target.href.split(/[\s/]+/);
          this.router.navigate([`profile/${x[x.length - 1]}`]);
        }, false);

      });
    }, 1500);
  }
  rootMsgPage(friendId) {
    this.utilServ.navChatwithId(friendId);
  }
  setupBasic() { }
  async openProtfolio() {
    if (this.scoutVisting === true) {
      localStorage.setItem('portfolioByScout', 'true');
    }
    const modal = await this.modalController.create({
      component: ProfilePortfolioComponent
    });
    modal.onDidDismiss().then((protfolioRes) => {
      localStorage.removeItem('portfolioByScout');
      if (this.scoutVisting === true) {
        this.router.navigate(['/scouts']);
      }
      this.checkedSegment = 'home';
      // console.table(protfolioRes);
    });

    return await modal.present();
  }
  back() {
    this.called = true;
    // if (localStorage.getItem('routingProfile') === 'true') {
    // localStorage.removeItem('routingProfile');
    // }
    this.location.back();
  }
  getTimeFromNow(createdDate) {
    return moment(createdDate).fromNow();
  }
  segmentChanged(e) {
    if (this.checkedSegment === 'media') {
      this.getAsserts();
    }
    if (this.checkedSegment === 'friends') {
      this.getFriends();
    }
  }
  getAsserts() {
    // tslint:disable-next-line: prefer-const
    let nullVall;
    this.apiService.getAssets(this.profileId, 0, 100, nullVall).subscribe((res: any) => {
      this.personalMedia = res.message.content;
      this.totalPersonalMedia = res.message.meta.total;
    });
  }
  async openMultiMedia(fullAsserts, i) {
    const xDx = {
      asserts: fullAsserts,
      currentIndex: i
    };
    localStorage.setItem('mediaArray', JSON.stringify(xDx));
    const modal = await this.modalcontrolller.create({
      component: MultimediaViewComponent,
      componentProps: {
        swipeToClose: true
      }
    });
    return await modal.present();
  }
  getFriends() {
    this.apiService.getFriendsList(this.profileId).subscribe((friends: any) => {
      this.myfrndsList = friends.message;
      this.friendsList = this.myfrndsList;
      if (this.friendsList.length === 0) {
        this.noFriends = true;
      }
    });
  }
  goToProfile(id) {
    this.router.navigate([`profile/${id}`]);
  }
  viewProfileImage(url, type) {
    // this.pic_url,'image'
    const imgAddress = `profile/${this.userProfileDetail.id}/${this.profilepicUrl}`;
    const x = [{
      post_type: type,
      asset_url: imgAddress,
      asset_thumb_url: imgAddress,
      asset_type: type
    }];
    this.openMultiMedia(x, 0);
  }
  viewCover(url, type) {
    if (this.called === false) {
      const temp = this.coverUrl;
      const pos = temp.lastIndexOf('/');
      const newchar = temp.substring(pos, temp.length);
      const imgAddress = `profile/${this.userProfileDetail.id}${newchar}`;
      const x = [{
        post_type: type,
        asset_url: imgAddress,
        asset_thumb_url: imgAddress,
        asset_type: type
      }];
      this.openMultiMedia(x, 0);
    }
  }
  setFilteredItem(x) {
    // console.log(x);
    this.friendsList = this.filter(this.myfrndsList, x || null);
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
  viewProfile(x) {
    this.router.navigate([`/profile/${x}`]);
  }
  async cancelFriendreq(userId) {
    const alert = await this.alertController.create({
      header: this.cancelString,
      message: this.cancelReqConfirmString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.okayString,
          handler: () => {
            const data = {
              cf_id: userId,
              hf_id: this.userDetail.id
            };
            this.socketAPI.emit('cancel-friend-request', data);
            this.unfriend = false;
            this.sendRequest = true;
            this.cancelRequest = false;
          }
        }
      ]
    });
    await alert.present();
  }
  sendFriendReq(UserId) {
    const data = {
      cf_id: this.userDetail.id,
      hf_id: UserId
    };
    this.apiService.createFriendRequest(data.cf_id, data.hf_id).subscribe((res: any) => {
      if (res.success === 1) {
        this.unfriend = false;
        this.sendRequest = false;
        this.cancelRequest = true;
      }
    });
    // console.log('SendFriend' + JSON.stringify(data));
    this.socketAPI.emit('send-friend-request', data);
    // this.unfriend = false;
    // this.sendRequest = false;
    // this.cancelRequest = true;
  }
  // Guardian Request
  sendGuardianReq(UserId, reqId) {
    this.apiService.createGuardianRequest(this.userDetail.id, UserId).subscribe((res: any) => {
      if (res.success === 1) {
        this.cancelSentGuardreq = true;
        this.sendGuardRequest = false;
        const data = { id: res.message.insertId };
        this.socketAPI.emit('guardian-send-request', data);
        this.utilServ.getMyMinors(this.userDetail.id);
        this.utilServ.getUserStatus(this.userDetail.id);
        this.getProfileDataOfUser();
      } else {
        // Toast Message
      }
    });
  }
  cancelGuardreq(reqId) {
    this.apiService.cancelGuardianRequest(reqId, this.userDetail.id).subscribe((res: any) => {
      if (res.success === 1) {
        this.sendGuardRequest = true;
        this.cancelSentGuardreq = false;
        this.utilServ.getMyMinors(this.userDetail.id);
        this.utilServ.getUserStatus(this.userDetail.id);
        const data = { id: reqId };
        this.socketAPI.emit('guardian-cancel-request', data);
      } else {
        // Toast Message
      }
    });
  }
  cancelGuardLink(reqId) {
    if (this.userStatus.isMinor === true) {
      // For Minor
      this.apiService.cancelGuardianConnection(reqId, this.userDetail.id).subscribe((res: any) => {
        if (res.success === 1) {
          this.utilServ.getMyMinors(this.userDetail.id);
          this.utilServ.getUserStatus(this.userDetail.id);
          this.sendGuardRequest = true;
          this.cancelSentGuardreq = false;
          this.cancelGuardianMinorLink = false;
          this.acceptRejGuardAction = false;
          const data = {
            athleteUserId: this.userDetail.id,
            guardianUserId: reqId,
            userId: this.userDetail.id
          };
          this.socketAPI.emit('guardian-cancel-link', data);
        } else {
          // Toast Message
        }
      });
    } else {
      // For guardian
      this.apiService.cancelGuardianConnection(this.userDetail.id, reqId).subscribe((res: any) => {
        if (res.success === 1) {
          this.utilServ.getMyMinors(this.userDetail.id);
          this.utilServ.getUserStatus(this.userDetail.id);
          this.sendGuardRequest = false;
          this.cancelSentGuardreq = false;
          this.cancelGuardianMinorLink = false;
          this.acceptRejGuardAction = false;
          const data = {
            athleteUserId: reqId,
            guardianUserId: this.userDetail.id,
            userId: this.userDetail.id
          };
          this.getMyMinor();
          this.socketAPI.emit('guardian-cancel-link', data);
        } else {
          // Toast Message
        }
      });

    }
  }
  async acceptGuardReq(block) {
    const x = this.userProfileData.baseInfo;
    const reqId = block.id;
    const daa = {
      guardName: '' + this.userDetail.first_name + ' ' + this.userDetail.last_name,
      minorName: '' + x.first_name + ' ' + x.last_name
    };
    localStorage.setItem('namesForAgreementGuard', JSON.stringify(daa));
    const modal = await this.modalController.create({
      component: GuardianTermsComponent,
      componentProps: {
      }
    });
    modal.onDidDismiss().then((code) => {
      localStorage.removeItem('namesForAgreementGuard');
      if (code.data === true) {
        this.apiService.acceptGuardianRequest(reqId, this.userDetail.id).subscribe((res: any) => {
          if (res) {
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = true;
            this.acceptRejGuardAction = false;
            const data = { id: reqId };
            this.socketAPI.emit('guardian-accept-request', data);
          }
        });
      }
    });
    return await modal.present();
  }
  deleteGuardReq(reqId) {
    this.apiService.rejectGuardianRequest(reqId, this.userDetail.id).subscribe((res: any) => {
      if (res) {
        this.getProfileDataOfUser();
        const data = { id: reqId };
        this.socketAPI.emit('guardian-reject-request', data);
      }
    });
  }
  async unFriend(userId, frndName) {
    const confirm = await this.alertController.create({
      header: this.unfriendString + '?',
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
              cf_id: userId,
              hf_id: this.userDetail.id
            };
            this.socketAPI.connect();
            this.socketAPI.emit('cancel-friend-request', data);
            this.unfriend = false;
            this.sendRequest = true;
            this.cancelRequest = false;
            this.utilServ.userAddonDetails();
            this.utilServ.friendsList = null;
            this.utilServ.userAddonDetails();
          }
        }
      ]
    });
    confirm.present();
  }
  async frndreqToast() {
    const toast = await this.toastController.create({
      message: this.friendRequestSentString,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  getProfileDataOfUser() {
    this.userStatus = null;
    this.getUserStatus();
    const iiinnn = setInterval(() => {
      if (this.userStatus) {
        this.apiService.getUserBaseInfoByUserId(this.userDetail.id, this.profileId).subscribe((res: any) => {
          this.userProfileData = res.message;
          // console.log(this.userProfileData);
          localStorage.setItem('guardianData', JSON.stringify(this.userProfileData.guardianData));
          // Minor
          // Minor has not sent Guardian request to anyone yet
          if (this.userStatus.isMinor === true && this.userStatus.isGuardedAthlete === false &&
            Object.keys(this.userProfileData.guardianRequest).length === 0) {
            // console.log("case 1");
            this.sendGuardRequest = true;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = false;
          }
          // Minor has sent Guardian request to guardian
          else if (this.userStatus.isMinor === true && this.userProfileData.guardianRequest.applicationstatus === 0) {
            // console.log("case 2");
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = true;
            this.cancelGuardianMinorLink = false;
          }
          // Minor has sent Guardian request to guardian and guardian has accepted it
          else if (this.userStatus.isMinor === true && this.userProfileData.guardianRequest.applicationstatus === 3
            && this.userStatus.guardianData.guardianUserId === this.profileId) {
            // console.log("case 3");
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = true;
          } // Now Minor has regular access as minor is guarded
          else if (this.userStatus.isMinor === true && this.userStatus.isGuardedAthlete === true &&
            this.userStatus.guardianData.guardianUserId !== this.profileId) {
            // console.log("case 4");
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = false;
            this.isMinor = false;
            this.regularUser(res);
          }
          // Guardian
          // Regular user has got guardian request
          else if (this.userStatus.isMinor === false && this.userStatus.isGuardian === false
            && this.userProfileData.guardianRequest.applicationstatus === 0) {
            // console.log("case 5");
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = false;
            this.acceptRejGuardAction = true;
          }
          // Regular user has accepted guardian request
          else if (this.userStatus.isMinor === false && this.userStatus.isGuardian === false
            && this.userProfileData.guardianRequest.applicationstatus === 3) {
            // console.log("case 6");
            this.cancelGuardianMinorLink = true;
            this.acceptRejGuardAction = false;
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
          }
          // Logged in user is regular user and profile id is guarded minor
          else if (this.userStatus.isMinor === false && this.userStatus.isGuardian === false
            && Object.keys(this.userProfileData.guardianData).length > 0) {
            // console.log("case 7");
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = false;
            this.regularUser(res);
          }
          // Guardian has minor // Guardian sees profile of own minor
          else if (this.userStatus.isGuardian === true && this.userProfileData.guardianRequest.guardianUserId === this.userDetail.id) {
            this.cancelGuardianMinorLink = true;
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            // console.log("case 8");
          }
          // Regular User sees profile of unguarded minor (UnderAge)
          else if (this.userStatus.isMinor === false && this.userStatus.isGuardian === false
            && this.userProfileData.baseInfo.age <= 18) {
            // console.log("case 9");
            this.acceptRejGuardAction = false;
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = false;
          }
          // Regular user(Neither minor nor guardian)
          else {
            // console.log("case 10");
            this.acceptRejGuardAction = false;
            this.sendGuardRequest = false;
            this.cancelSentGuardreq = false;
            this.cancelGuardianMinorLink = false;
            this.regularUser(res);
          }
        });
        clearInterval(iiinnn);
      }
    }, 20);

  }
  regularUser(res) {
    if (res.message.extraInfo.isFriend === 1) {
      this.unfriend = true;
      this.sendRequest = false;
      this.cancelRequest = false;
      this.acceptRejAction = false;
    }
    if (res.message.extraInfo.isFriend === null) {
      this.unfriend = false;
      this.sendRequest = true;
      this.cancelRequest = false;
      this.acceptRejAction = false;
    }
    if (res.message.requestInfo.send_request === 1) {
      this.unfriend = false;
      this.sendRequest = false;
      this.cancelRequest = true;
      this.acceptRejAction = false;
    }
    if (res.message.requestInfo.our_request === 1) {
      this.sendRequest = false;
      this.acceptRejAction = true;
    }
  }
  async acceptFrndReq(itemId) {
    const alert = await this.alertController.create({
      message: this.acceptFrndReqString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: this.okayString,
          handler: () => {
            this.data = {
              user_id: this.userDetail.id,
              friend_id: itemId
            };
            this.socketAPI.emit('accept-friend', this.data);
            this.utilServ.userAddonDetails();
            this.utilServ.friendsList = null;
            this.getProfileDataOfUser();
          }
        }
      ]
    });
    await alert.present();
  }
  async deleteFrndReq(itemId) {
    const alert = await this.alertController.create({
      message: this.deleteFrndReqString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: this.okayString,
          handler: () => {
            this.data = {
              user_id: this.userDetail.id,
              friend_id: itemId
            };
            this.socketAPI.emit('reject-friend', this.data);
            this.utilServ.userAddonDetails();
            this.utilServ.friendsList = null;
            this.getProfileDataOfUser();
          }
        }
      ]
    });
    await alert.present();
  }
  presentActionSheetProfileBG() {
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        // this.coverUrl = imgData.webPath;
        this.apiService.uploadcoverprofile(imgData.blob, this.userDetail.id).subscribe((data: any) => {
          this.coverUrl = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=profile/${this.profileId}/${data.message}`;
          localStorage.removeItem('userdetail');
          this.userDetail.profile_bg_img_url = data.message;
          localStorage.setItem('userdetail', JSON.stringify(this.userDetail));
          this.utilServ.hideLoaderWait();
          this.utilServ.hideLoaderWait();
          this.eventCustom.destroy('imageReady');
        },
          error => {
          });
      }
    });
  }
  presentActionSheetProfile() {
    // this.utilServ.showLoaderWait();
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        // console.log('imgData', imgData);
        this.profilepicUrl = null;
        this.userProfileDetail.profile_img_url = '';
        this.apiService.uploadprofile(imgData.blob, this.userDetail.id).subscribe((data: any) => {
          setTimeout(() => {
            this.profilepicUrl = data.message.original;
            this.userProfileDetail.profile_img_url = `profile/${this.profileId}/${this.profilepicUrl}`;
            this.userDetail.profile_img_url_thump = data.message.thumbnail;
            this.userDetail.profile_img_url = this.userProfileDetail.profile_img_url;
            localStorage.setItem('userdetail', JSON.stringify(this.userDetail));
            this.utilServ.resetDefaults();
            setTimeout(() => {
              this.utilServ.setUpUser();
              this.eventCustom.publish('userdetail', this.userDetail);
              this.postsArray = [];
              this.loadPost();
            }, 200);
            this.eventCustom.destroy('imageReady');
          }, 800);
        });
      }
    });
  }


  async openPopUpEdit(x, post, userId) {
    if (this.userDetail.id === userId && post.shared === 0) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.deleteString,
          handler: async () => {
            const alert = await this.alertController.create({
              message: this.sureDeleteString,
              buttons: [
                {
                  text: this.cancelString,
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                  }
                }, {
                  text: this.yesString,
                  handler: () => {
                    this.deletePost(x, post.id);
                  }
                }
              ]
            });
            await alert.present();
          }
        }, {
          text: this.editString,
          handler: () => {
            this.editPost(x, post);
          }
        }, {
          text: this.cancelString,
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
    } else if (this.userDetail.id === userId && post.shared === 1) {
      const actionSheet = await this.actionSheetController.create({
        // mode: 'ios',
        // header: 'Albums',
        // cssClass: 'my-custom-class',
        buttons: [{
          text: this.deleteString,
          handler: () => {
            this.deletePost(x, post.id);
          }
        }, {
          text: this.cancelString,
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
    } else {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.reportString,
          icon: 'alert-circle-outline',
          handler: () => {
            this.reportPost(post, post.id);
          }
        }]
      });
      await actionSheet.present();
    }
    // if (this.postsArray[x].popUP) {
    //   this.postsArray[x].popUP = false;
    // } else {
    //   this.postsArray[x].popUP = true;
    //   this.popUpEdit.open();
    //   // this.postsArray[x].popUP.open();
    // }
    // setTimeout(() => {
    //   this.postsArray[x].popUP = false;
    // }, 8000);
  }
  async reportPost(post, postId) {
    const confirm = await this.alertController.create({
      header: this.reportString,
      message: this.enterReasonString + '?',
      inputs: [
        {
          name: 'reasonToReport',
          type: 'text',
          placeholder: this.reasonToReportString
        }],
      buttons: [{
        text: this.cancelString,
        role: 'cancel',
      },
      {
        text: this.okayString,
        handler: (event) => {
          // console.log("asdf");
          this.apiService.reportuser(post.user.id, event.reasonToReport, 'post'
            , '', this.userDetail.id, postId).subscribe((res: any) => {
              if (res.success === 1) {
                this.utilServ.presentToast(this.reportSubmittedString);
              }
            });
        }
      }
      ]
    });
    confirm.present();
  }
  async profileOwnerAction() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: this.viewCoverString,
        handler: () => {
          this.viewCover(this.coverUrl, 'image');
        }
      }, {
        text: this.changeCoverString,
        handler: () => {
          this.presentActionSheetProfileBG();
        }
      }]
    });
    await actionSheet.present();
  }

  async actionOnOtherUser() {
    const actionSheet = await this.actionSheetController.create({
      // mode: 'ios',
      // header: 'Albums',
      // cssClass: 'my-custom-class',
      buttons: [{
        text: this.viewCoverString,
        handler: () => {
          this.viewCover(this.coverUrl, 'image');
        }
      }, {
        text: this.reportUserString,
        handler: () => {
          this.reportUser();
        }
      }]
    });
    await actionSheet.present();
  }
  async reportUser() {
    const confirm = await this.alertController.create({
      header: this.reportString,
      message: this.enterReasonString + '?',
      inputs: [
        {
          name: 'reasonToReport',
          type: 'text',
          placeholder: this.reasonToReportString
        }],
      buttons: [{
        text: this.cancelString,
        role: 'cancel',
      },
      {
        text: this.okayString,
        handler: (event) => {
          this.apiService.reportuser(this.profileId, event.reasonToReport, 'user'
            , '', this.userDetail.id, null).subscribe((res: any) => {
              if (res.success === 1) {
                this.utilServ.presentToast(this.reportSubmittedString);
              }
            });
        }
      }
      ]
    });
    confirm.present();
  }
  async editPost(x, post) {
    localStorage.setItem('postDataEdit', JSON.stringify(post));
    const modal = await this.modalController.create({
      component: EditPostComponent,
      componentProps: {
        custom_data: null
      }
    });
    modal.onDidDismiss().then((data) => {
      this.postsArray = [];
      this.loadPost();
      localStorage.removeItem('postDataEdit');
    });
    return await modal.present();

  }

  deletePost(x: number, postID: number) {
    this.apiService.deletePostTimeline(postID).subscribe((delet: any) => {
      if (delet.success === 1) {
        this.postsArray.splice(x, 1);
      }
    });
  }
  sendMessage() {
    this.utilServ.navChatwithId(this.profileId);
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.portfolioString = this.utilServ.getLangByCode('portfolioString');
      this.friendsString = this.utilServ.getLangByCode('friends');
      this.unfriendString = this.utilServ.getLangByCode('unfriend');
      this.friendRequestSentString = this.utilServ.getLangByCode('friend_req_Send');
      this.unfriendConfirmString = this.utilServ.getLangByCode('unfriendConfirmString').replace(/%X/gi, '').replace('?', '');
      this.cancelReqConfirmString = this.utilServ.getLangByCode('are_you_cancel_friend_req');
      this.addFriendString = this.utilServ.getLangByCode('add_friend');
      this.searchString = this.utilServ.getLangByCode('search');
      this.acceptRequestString = this.utilServ.getLangByCode('accept');
      this.deleteRequestString = this.utilServ.getLangByCode('decline');
      this.acceptFrndReqString = this.utilServ.getLangByCode('are_you_accept_frnd_req');
      this.deleteFrndReqString = this.utilServ.getLangByCode('are_you_cancel_friend_req');
      this.enterReasonString = this.utilServ.getLangByCode('whats_the_reason');
      this.reasonToReportString = this.utilServ.getLangByCode('reason_reporting');
      this.reportSubmittedString = this.utilServ.getLangByCode('submit_report');

      this.noPostString = this.utilServ.getLangByCode('no_post_available');
      this.reportString = this.utilServ.getLangByCode('report_spam_abuse');
      this.deleteString = this.utilServ.getLangByCode('delete');
      this.editString = this.utilServ.getLangByCode('edit');
      this.someonesPostString = this.utilServ.getLangByCode('someonesPostString');
      this.sharedString = this.utilServ.getLangByCode('shared');
      this.postString = this.utilServ.getLangByCode('post');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.homeString = this.utilServ.getLangByCode('home');
      this.mediaString = this.utilServ.getLangByCode('media');
      this.requestedString = this.utilServ.getLangByCode('requested');
      this.okayString = this.utilServ.getLangByCode('ok');
      this.noFriendString = this.utilServ.getLangByCode('no_frnd_list');
      this.noMediaString = this.utilServ.getLangByCode('no_media_available');
      this.alreadySharedString = this.utilServ.getLangByCode('alreadySharedString');
      this.sharedPostString = this.utilServ.getLangByCode('post_shared');
      this.noFriendpostString = this.utilServ.getLangByCode('friendsprofile.label.nopost');
      this.shareString = this.utilServ.getLangByCode('common.label.shareConfirmation');
      this.sureDeleteString = this.utilServ.getLangByCode('are_sure_delete_post');
      this.yesString = this.utilServ.getLangByCode('yes');
    }
  }
  getUserStatus() {
    this.userStatus = null;
    this.apiService.getUserStatus(this.userDetail.id).subscribe((res: any) => {
      this.userStatus = res.message;
      if (this.userStatus.isMinor === true) {
        this.isMinor = true;
      } else {
        this.isMinor = false;
        this.isGuardian = true;
      }
    });
  }
  getMyMinor() {
    this.apiService.getGuardedAthletes(this.userDetail.id).subscribe((res: any) => {
      if (res) {
        if (res.message.length > 0) {
          this.eventCustom.publish('showGuardianTool', true);
        } else {
          this.eventCustom.publish('showGuardianTool', false);
        }
      }
    });
  }
}
