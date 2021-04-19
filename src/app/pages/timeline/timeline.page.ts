import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import * as moment from 'moment';
import { ModalController, ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { CommentOnPostComponent } from 'src/app/components/comment-on-post/comment-on-post.component';
import { EditPostComponent } from 'src/app/components/edit-post/edit-post.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraSource, Capacitor } from '@capacitor/core';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { WelcomePageComponent } from 'src/app/components/welcome-page/welcome-page.component';
import { Socket } from 'ngx-socket-io';

import { File, DirectoryEntry, FileEntry } from '@ionic-native/file/ngx';
import { MultimediaViewComponent } from 'src/app/components/multimedia-view/multimedia-view.component';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
window.URL = window.URL || window.webkitURL;
import { Plugins } from '@capacitor/core';
import { FcmServiceService } from 'src/app/services/fcm-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SearchInAppComponent } from 'src/app/components/search-in-app/search-in-app.component';
import { SelectSportsOrLagacyComponent } from 'src/app/components/select-sports-or-lagacy/select-sports-or-lagacy.component';

const { SplashScreen } = Plugins;
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {
  @ViewChild('contentMain') contentForScroll: any;
  @ViewChild('postText') postText: any;
  @ViewChild('popUpEdit') popUpEdit: any;
  @ViewChild('userInput') userInputViewChild: ElementRef;
  @ViewChild('userInputForIos') userInputViewChildForIos: ElementRef;


  customAlertOptions: any;

  // Basic User Details
  userDetail;
  profileImageURL;
  profileFirstname;
  profileLastName;
  profilePicUrl;
  profileId;
  postsArray: any[] = [];
  strMn;
  legacySportIcon = '';
  environment;
  postContent: string;
  tempPostContent: string;
  showPostButton = false;
  friendsList: any[] = [];
  showMensionPickUp = false;
  tempFriendTag: any;
  tempMensionString = '';
  tempReplacement: any[] = [];
  innerTemp = '';
  firstTimeTag = true;
  tempString = '';
  atCount: any;
  currentSerachTag;
  currentSearchArray: string[];
  temprary = false;
  totalPost: any;
  noPost = false;
  limitReached = true;
  showUpdateText = false;
  modalOpen = false;
  showUpdateTextCondion = false;
  showGoTop = false;
  userInputElement: HTMLInputElement;
  userInputElementForIos: HTMLInputElement;
  mediaUrl: HTMLImageElement;
  processing: boolean;
  mediaArray = [];
  imagePath;
  files: FileList;
  imageExtArray = ['image/gif', 'image/jpeg', 'image/png', 'image/heic'];
  vidExtArray = ['video/webm', 'video/mpg', 'video/mp4', 'video/avi', 'video/mov', 'mp4', 'mov', 'video/3gpp', 'webm', 'video/quicktime', 'qt', 'MPEG-4', 'MPEG', 'HEIF', 'HEVC'];
  xyz: any;
  searchFriendsList: any[] = [];
  progressBarval = 0;
  showProgressFlag = false;
  rotateImg = false;
  showCloseBtn = true;
  showLoadingImage = false;
  postReadonly = false;
  selectedMediaLoader = [];
  tempVar;
  videoProcesComplete = true;
  minorData;
  regularUser = true;
  videoData: any;
  showClose = false;
  taggedSportFlag = false;
  tagSportId = null;
  // Strings
  timelineString = 'Timeline';
  postString = 'Post';
  sharedString = 'Shared';
  someonesPostString = '\'s post';
  editString = 'Edit';
  deleteString = 'Delete';
  reportString = 'Report';
  noPostString = 'No post\'s to show create a post and share with your friends';
  postPlaceholder = 'What\'s on your mind ?';
  cancelString = 'Cancel';
  takePictureString = 'Take Picture';
  takeVideoString = 'Take Video';
  galleryString = 'Gallery';
  alreadySharedString = 'Already Shared';
  sharedPostString = 'Post has been shared.';
  enterReasonString = 'Please type your reason for reporting';
  okString = 'Ok';
  reasonToReportString = 'Write your reason here';
  reportSubmittedString = 'Report has been submitted';
  mediaTypeNotFoundString = 'Media type is not supported';
  updateString = 'Update';
  fileSizeLargeString = 'File too large';
  imageString = 'Image';
  videoString = 'Video';
  uploadMedialErrorString = 'Unable to upload. Please try again';
  getingFeedString = 'Getting Feeds';
  shareString = 'Are you sure you want to share this post?';
  captureImageString = 'Capture Image';
  captureVideoString = 'Record Video';
  pickImageString = 'Select Image';
  pickVideoString = 'Select Video';
  blockAccessGetGuardianString = 'Access is restricted, please get an adult guardian for your account';
  safeUrl: any;
  friendsString = 'Friends';
  groupsString = 'Groups';
  teamsString = 'Teams';
  eventsString = 'Events';
  editProfileString = 'Edit Profile';
  changeLanguageString = 'Change Language';
  searchString = 'Search';
  videoDescString = 'Video is introductory video';
  tagSportString = 'Tag sport';
  tagSportIcon = 'baseball';
  mp4FilesOnlyString = 'Please select mp4 files';
  sureDeleteString = 're you sure you want to delete this post?';
  yesString = 'Yes';
  webTrib = false;
  quickInfo: { teams: any; groups: any; friends: any; events: any; };
  constructor(
    private camera: Camera,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private socketAPI: Socket,
    private apiService: ApiService,
    private element: ElementRef,
    private alertController: AlertController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private modalcontrolller: ModalController,
    private fcmService: FcmServiceService,
    private router: Router,
    private utilServ: GenralUtilsService,
    private actRouter: ActivatedRoute,
    private mediaCapture: MediaCapture,
    private videoEditor: VideoEditor,
    private filePath: FilePath,
    public nativeLib: DeviceNativeApiService,
    private eventCustom: EventsCustomService,
    private file: File) {
    this.actRouter.queryParams.subscribe(() => {
      this.fcmService.readNotification();
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());

      this.quickInfo = this.utilServ.userQuickInfo();
      this.webTrib = this.platform.is('desktop');
      this.eventCustom.destroy('imageReady');
      if (this.utilServ.friendsList) {
        this.friendsList = this.utilServ.friendsList;
      }
      this.setupBasicDetails(); false
      if (!this.userDetail) {
        const iini = setInterval(() => {
          this.eventCustom.subscribe('userDetail', (e) => {
            this.userDetail = e;
            if (this.userDetail) {
              this.setupBasicDetails();

              if (this.postsArray.length === 0 || !this.postsArray) {
                this.loadPost();
                this.dontReloadMension();
              }
              clearInterval(iini);
            }
          });

        }, 50);
      } else {
        this.setupBasicDetails();

        if (this.postsArray.length === 0 || !this.postsArray) {
          this.loadPost();
          this.dontReloadMension();
        }
      }


      this.eventCustom.publish('wallpostRead', 1);

      this.socketAPI.on('wallPost-event', (data) => {
        if (data.user.id !== this.userDetail.id) {
          this.showUpdateTextCondion = true;
        }
      });
      this.eventCustom.publish('badgeCount', '');
      let fistLoginData;
      fistLoginData = JSON.parse(localStorage.getItem('userdetail'));
      if (fistLoginData.first_login == 0) {
        this.apiService.updateFirstLogin(this.userDetail.id).subscribe((res: any) => {
          if (res) {
            this.openWelcomeComp();
          }
        });
        localStorage.removeItem('userdetail');
        this.userDetail.first_login = 1;
        localStorage.setItem('userdetail', JSON.stringify(this.userDetail));
      }
      this.socketAPI.emit('messageStatusUpdate', { status: 2, fromid: this.userDetail.id, update: 1 });

    });
  }

  ngOnInit() {
    this.environment = environment;
    this.setupBasicDetails();
    this.customAlertOptions = {
      animated: true,
      translucent: true,
      mode: 'ios',
      cssClass: 'addSectionProtfolio',
    };
    setTimeout(() => {
      const z = JSON.parse(localStorage.getItem('setupAfterLogin'));
      if (z === true) {
        localStorage.setItem('setupAfterLogin', 'false');
        setTimeout(() => {
          this.utilServ.initSockets();
        }, 500);
      }
    }, 2000);
    setTimeout(() => {
      this.utilServ.hideLoaderWaitAMin();
      this.utilServ.hideLoaderWait();
    }, 1500);
  }

  ionViewWillEnter() {
    this.utilServ.checkUserExists();
    this.friendsList = this.utilServ.friendsList;
    this.eventCustom.destroy('imageReady');
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    this.eventCustom.destroy('imageReady');
    this.userInputElement = this.userInputViewChild.nativeElement;
    this.userInputElementForIos = this.userInputViewChildForIos.nativeElement;
  }
  async openWelcomeComp() {
    const modal = await this.modalController.create({
      component: WelcomePageComponent,
      componentProps: {
        custom_data: null
      }
    });
    modal.onDidDismiss().then((data) => {

    });
    return await modal.present();

  }
  setupBasicDetails() {
    setTimeout(() => {
      SplashScreen.hide();
      this.utilServ.hideLoaderWaitAMin();
      if (this.utilServ.loderUp === true) {
        this.utilServ.hideLoaderWait();
      } else {
        setTimeout(() => {
          this.utilServ.hideLoaderWait();
        }, 20);
      }
    }, 200);
    if (!this.userDetail) {
      this.utilServ.navLogin();
      // window.location.reload();
    } else if (this.userDetail) {
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
        // & this.minorData.guarded;
      });
      this.profileId = this.userDetail.id;
      this.profileImageURL = this.userDetail.profile_img_url_thump;
      this.profileFirstname = this.userDetail.first_name;
      this.profileLastName = this.userDetail.last_name;
      if (this.utilServ.langSetupFLag) {
        this.noPostString = this.utilServ.getLangByCode('no_post_available');
        this.reportString = this.utilServ.getLangByCode('report_spam_abuse');
        this.deleteString = this.utilServ.getLangByCode('delete');
        this.editString = this.utilServ.getLangByCode('edit');
        this.someonesPostString = this.utilServ.getLangByCode('someonesPostString');
        this.postPlaceholder = this.utilServ.getLangByCode('post_placeholder');
        this.sharedString = this.utilServ.getLangByCode('shared');
        this.postString = this.utilServ.getLangByCode('post');
        this.cancelString = this.utilServ.getLangByCode('cancel');
        this.timelineString = this.utilServ.getLangByCode('timeline');
        this.galleryString = this.utilServ.getLangByCode('gallery');
        this.takePictureString = this.utilServ.getLangByCode('take_photo');
        this.takeVideoString = this.utilServ.getLangByCode('take_video');
        this.alreadySharedString = this.utilServ.getLangByCode('alreadySharedString');
        this.sharedPostString = this.utilServ.getLangByCode('post_shared');
        this.enterReasonString = this.utilServ.getLangByCode('whats_the_reason');
        this.reasonToReportString = this.utilServ.getLangByCode('reason_reporting');
        this.reportSubmittedString = this.utilServ.getLangByCode('submit_report');
        this.okString = this.utilServ.getLangByCode('okay');
        this.updateString = this.utilServ.getLangByCode('update');
        this.fileSizeLargeString = this.utilServ.getLangByCode('common.label.fileTooLargeWarning');
        this.imageString = this.utilServ.getLangByCode('image');
        this.videoString = this.utilServ.getLangByCode('video');
        this.shareString = this.utilServ.getLangByCode('common.label.shareConfirmation');
        this.captureImageString = this.utilServ.getLangByCode('take_photo');
        this.captureVideoString = this.utilServ.getLangByCode('take_video');
        this.pickImageString = this.utilServ.getLangByCode('choose_image');
        this.pickVideoString = this.utilServ.getLangByCode('choose_video');
        this.blockAccessGetGuardianString = this.utilServ.getLangByCode('minor.noGuardian.message');
        this.groupsString = this.utilServ.getLangByCode('groups');
        this.friendsString = this.utilServ.getLangByCode('friends');
        this.eventsString = this.utilServ.getLangByCode('events');
        this.changeLanguageString = this.utilServ.getLangByCode('language');
        this.editProfileString = this.utilServ.getLangByCode('edit_profile');
        this.teamsString = this.utilServ.getLangByCode('team');
        this.searchString = this.utilServ.getLangByCode('search');
        this.sureDeleteString = this.utilServ.getLangByCode('are_sure_delete_post');
        this.yesString = this.utilServ.getLangByCode('yes');
      }

      const initFrends = setInterval(() => {
        if (this.utilServ.friendsList) {
          this.friendsList = this.utilServ.friendsList;

          if (this.friendsList.length > 0) {
            this.searchFriendsList = this.friendsList;
            clearInterval(initFrends);
          }
        } else {
          this.utilServ.userAddonDetails();
        }
      }, 80);
    }
  }
  updateAvilable() {
    this.contentForScroll.scrollToTop(500);
    this.showUpdateTextCondion = false;
    this.eventCustom.publish('wallpostRead', 1);
    setTimeout(() => {
      this.postsArray = [];
      this.loadPost();
    }, 1000);

  }

  logScrolling(event) {

    if (event.detail.scrollTop >= 736) {
      this.showUpdateText = true;
      // this.showUpdateTextCondion = true;
    } else {
      this.showUpdateText = false;
      // this.showUpdateTextCondion = false;
    }
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

  postContentEdit(x: string) {
    if (this.showMensionPickUp === false) {
      this.atCount = x.length;
    }
    this.currentSearchArray = x.split('@');
    this.currentSerachTag = this.currentSearchArray[this.currentSearchArray.length - 1];
    if (this.currentSearchArray.length > 1 && this.showMensionPickUp === true) {
      // console.log('curentsearch', this.currentSerachTag.length, ' : ', this.currentSerachTag);
    }

    if (this.showMensionPickUp === true) {
      this.search(this.currentSerachTag);
    }

    const strng = this.utilServ.formatString(this.postContent);
    if ((this.postContent === '' || strng === '') && this.mediaArray.length === 0) {
      this.showPostButton = false;
    } else {
      this.showPostButton = true;
    }
    // console.log('this.currentSearchArray',this.currentSearchArray);
    // console.log('this.currentSerachTag',this.currentSerachTag);
    // console.log('\n\n\n')
  }

  onFriendTag(x) {
    this.tempFriendTag = { id: x.id, name: x.name };
    const t = this.occurrences(this.tempFriendTag.name, ' ', false);
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < t; index++) {
      this.tempFriendTag.name = this.tempFriendTag.name.replace(' ', '_');
      // const element = array[index];
    }
    this.tempFriendTag.name = this.tempFriendTag.name.toUpperCase();
    const ttmp = {
      replaced: this.tempFriendTag.name,
      name: x.name,
      id: this.tempFriendTag.id,
    };
    let front = this.postContent.substr(0, this.atCount);
    if (front.endsWith('@')) {
      front = front;
    } else {
      front = this.postContent.substr(0, (this.atCount + 1));
    }
    this.postContent = front + '' + this.tempFriendTag.name + ' ';
    this.tempReplacement.push(ttmp);
    this.showMensionPickUp = false;
    this.moveFocus(this.postText);
    this.searchFriendsList = this.friendsList;
  }
  search(x) {
    this.searchFriendsList = this.filter(this.friendsList, x || null);
  }
  filter(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(terms);
    });
  }

  occurrences(stng, subString, allowOverlapping) {
    stng += '';
    subString += '';
    if (subString.length <= 0) { return (stng.length + 1); }
    let n = 0;
    let pos = 0;
    const step = allowOverlapping ? 1 : subString.length;
    while (true) {
      pos = stng.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else { break; }
    }
    return n;
  }


  loadMorePost(eve) {
    setTimeout(() => {
      if (this.postsArray.length === this.totalPost) {
        this.limitReached = true;
      } else {
        this.loadPost();
      }
      eve.target.complete();
    }, 1000);
  }
  postLegacySelect() {
    // console.log('sports');
  }

  async openPopUpEdit(x, post, userId) {
    // console.log('x', x, '\npost', post, '\nuserId ', userId);
    if (this.userDetail.id === userId && post.shared === 0) {
      const actionSheet = await this.actionSheetController.create({
        // mode: 'ios',
        // header: 'Albums',
        // cssClass: 'my-custom-class',
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
            this.reportPost(post.id, userId);
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
  async reportPost(postId, userId) {
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
        text: this.okString,
        handler: (event) => {
          this.apiService.reportuser(userId, event.reasonToReport, 'post'
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
  // Post CRUD
  loadPost() {
    let offset = 0;
    if (this.postsArray.length !== 0) {
      offset = this.postsArray.length + 15;
    }

    this.apiService.getPostTimeline(offset, this.userDetail.id).subscribe((timelineRes: any) => {
      if (timelineRes.success === 1) {
        const postTemp = timelineRes.message;
        if (this.postsArray.length === 0) {
          this.postsArray = postTemp.content;
          this.limitReached = false;
          this.totalPost = postTemp.meta.total;
          this.noPost = false;
          this.apiService.getIntroVideoData().subscribe((res: any) => {
            if (res) {
              this.videoData = res.message;
              if (this.videoData) {
                this.videoData.forEach(element => {
                  if (element.content) {
                    element.content = this.utilServ.getLangByCode(element.content);
                    element.showMore = false
                  }
                });
              }
            }
          });
        } else {
          if (postTemp.content.length >= 1) {
            postTemp.content.forEach(post => {
              this.postsArray.push(post);
            });
            this.noPost = false;
          } else {
            this.limitReached = true;
          }
          // this.apiService.getIntroVideoData().subscribe((res: any) => {
          //   if(res){
          //     this.videoData = res.message;
          //     if(this.videoData){
          //       this.videoData.forEach(element => {
          //         if(element.content){
          //           element.content = this.utilServ.getLangByCode(element.content);
          //           element.showMore = false
          //         }
          //       });
          //     }
          //   }
          // });
        }
        this.dontReloadMension();
        if (this.totalPost === 0) {
          this.noPost = true;
        }
      }

    });
  }

  creatPost() {
    // alert('dfgdfgdfgg::::'+ this.taggedSportFlag);
    this.showProgressFlag = true;
    this.showPostButton = false;
    this.showCloseBtn = false;
    this.postReadonly = true;
    // this.progressBarval = 0.1;
    // tslint:disable-next-line: prefer-const
    let emptyVar;
    let mensionIds: number[] = [];
    this.tempPostContent = this.postContent;
    if (this.tempReplacement.length !== 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.tempReplacement.length; i++) {
        // tslint:disable-next-line: no-shadowed-variable
        const xDx = this.tempReplacement[i];
        mensionIds.push(xDx.id);
        // tslint:disable-next-line: max-line-length
        this.tempPostContent = this.tempPostContent.replace(`@${xDx.replaced}`, ` <a href=\'${xDx.id}\' class=\'make_a_tag\'> ${xDx.name} </a> `);
      }
      // this.temprary = true;
      if (mensionIds.length === 0) {
        mensionIds = emptyVar;
      }
      const garbageSubString = this.occurrences(this.tempPostContent, '↵', false);
      for (let j = 0; j <= garbageSubString; j++) {
        this.tempPostContent = this.tempPostContent.replace('↵', ' ');
      }
    }
    let xDx: any[] = [];
    this.mediaArray.forEach(element => {
      xDx.push({
        originalImage: element.name,
        thumbnailImage: element.thumbname
      });
    });
    // const uploadInt = setInterval(() => {
    // console.log('media::', this.mediaArray.length, '   xDx.length::: ', xDx.length);
    if (this.mediaArray.length === xDx.length) {
      if (xDx.length === 0) {
        xDx = this.tempVar;
      }
      if (mensionIds.length === 0) {
        mensionIds = this.tempVar;
      }
      this.apiService.savePostTimeline(emptyVar,
        this.userDetail.id, this.tempPostContent, this.tagSportId, xDx, mensionIds).subscribe((event: HttpEvent<any>) => {
          // console.log('postAfter upload', event.type);
          switch (event.type) {
            case HttpEventType.Sent:
              this.progressBarval = 0.3;
              break;
            case HttpEventType.ResponseHeader:
              this.progressBarval = 1;
              break;
            case HttpEventType.UploadProgress:
              this.progressBarval = Math.round(event.loaded / event.total) - 0.07;
              break;
            case HttpEventType.Response:
              setTimeout(() => {
                this.socketAPI.emit('wallPost-event', event.body.message);
                this.emitMensionSocket(event.body.message.userinfo.id);
                this.tempPostContent = '';
                this.postContent = '';
                this.mediaArray = [];
                this.postsArray = [];
                this.progressBarval = 0;
                this.loadPost();
                this.checkMediaToUpload();
                this.showProgressFlag = false;
                this.showCloseBtn = true;
                this.postReadonly = false;
                this.closeTag();
                // clearInterval(uploadInt);
              }, 150);
          }
        });
    }
    // }, 2000);
  }

  emitMensionSocket(postId) {
    const arr = this.tempReplacement;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < arr.length; i++) {
      const xDx = arr[i];
      const dataToSend = {
        user_id: xDx.id,
        poster_id: this.userDetail.id,
        post_id: postId,
        username: this.userDetail.first_name + ' ' + this.userDetail.last_name
      };
      this.socketAPI.emit('mention-event', dataToSend);
    }
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
        if (this.postsArray.length === 0) {
          this.noPost = true;
        }
      }
    });
  }

  likePost(postId, xx, postUser) {
    // console.log(postId, xx, postUser);
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
          text: this.okString,
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

  dismissAdminPost(postId) {
    // console.log(postId);
  }

  private dontReloadMension(): void {
    setTimeout(() => {
      const urls: any = this.element.nativeElement.querySelectorAll('a');
      urls.forEach((url) => {
        url.addEventListener('click', (event) => {
          const textOfLink = event.target.innerText;
          if (textOfLink === 'Terms of Service' || textOfLink === 'Terms and conditions' || textOfLink === 'Privacy Policy' || textOfLink === 'Contact us' || textOfLink === 'More' || textOfLink === 'less' || textOfLink === 'Show less' || textOfLink === 'Show More') {
          } else {
            event.preventDefault();
            const x = event.target.href.split(/[\s/]+/);
            console.log("dcddddd", x);
            this.router.navigate([`profile/${x[x.length - 1]}`]);
          }
        }, false);
      });
    }, 1500);
  }

  mensioning(x: string) {
    if (x.endsWith('@')) {
      this.showMensionPickUp = true;
    } else if (x.endsWith(' ')) {
      this.showMensionPickUp = false;
    }
    // if (x === 50 || ) {
    //   this.showMensionPickUp = true;
    // }
  }
  break(x) {
    this.showMensionPickUp = false;
    this.searchFriendsList = this.friendsList;
    this.moveFocus(this.postText);
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }
  goToProfile(id) {
    this.router.navigate([`profile/${id}`]);
  }
  getTimeFromNow(createdDate) {
    return moment(createdDate).fromNow();
  }

  async openMultiMedia(fullAsserts, i) {
    if (this.modalOpen === false) {
      this.modalOpen = true;
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
      modal.onDidDismiss().then((data) => {
        this.modalOpen = false;
      });
      return await modal.present();
    }
  }

  async attachMediaInPost() {
    if (this.platform.is('android')) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.captureImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Camera);
            this.getImageForIos();
          }
        }, {
          text: this.captureVideoString,
          handler: () => {
            this.captureVideo();
          }
        }, {
          text: this.pickImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Photos);
            this.getImageForIos();
          }
        }, {
          text: this.pickVideoString,
          handler: () => {
            const options: CameraOptions = {
              quality: 100,
              destinationType: (<any>window).Camera.DestinationType.FILE_URI,
              sourceType: (<any>window).Camera.PictureSourceType.PHOTOLIBRARY,
              mediaType: (<any>window).Camera.MediaType.VIDEO
            };
            this.camera.getPicture(options).then(async (data) => {
              this.showLoadingImage = true;
              this.showCloseBtn = false;
              this.videoProcesComplete = false;
              this.selectedMediaLoader.push(data);
              const VideoEditorOptions = {
                OptimizeForNetworkUse: {
                  NO: 0,
                  YES: 1
                },
                OutputFileType: {
                  M4V: 0,
                  MPEG4: 1,
                  M4A: 2,
                  QUICK_TIME: 3
                }
              };
              this.videoEditor.getVideoInfo({
                fileUri: 'file://' + data,
              }).then(vidInfo => {
                if (vidInfo.size > 270000000) {
                  this.utilServ.presentToast(this.fileSizeLargeString);
                  this.videoProcesComplete = true;
                  this.showCloseBtn = true;
                  this.selectedMediaLoader.pop();
                  this.videoProcesComplete = true;
                  return;
                } else {
                  this.videoEditor.transcodeVideo({
                    fileUri: 'file://' + data,
                    outputFileName: this.utilServ.getTimeStamp(),
                    outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                    optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.NO,
                    maintainAspectRatio: true,
                    videoBitrate: 20000000,
                    fps: 30,
                    saveToLibrary: false,
                  })
                    .then(async (fileUri: string) => {
                      const webPathVideo = Capacitor.convertFileSrc(fileUri);
                      const response = await fetch(webPathVideo);
                      const blb = await response.blob();
                      this.apiService.uploadTimelineMedia(blb, this.userDetail.id, this.utilServ.getTimeStamp() + '.MP4').
                        subscribe((uploadRes: any) => {
                          if (uploadRes.success === 1) {
                            this.showLoadingImage = false;
                            this.showCloseBtn = true;
                            this.selectedMediaLoader.pop();
                            this.mediaArray.unshift(uploadRes.message.info);
                            this.videoProcesComplete = true;
                            this.checkMediaToUpload();
                          } else {
                            this.showLoadingImage = false;
                            this.videoProcesComplete = true;
                            this.showCloseBtn = true;
                            this.selectedMediaLoader = [];
                            this.utilServ.presentToast(this.uploadMedialErrorString);
                          }
                        });
                    }, (err) => {
                      // console.log(err);
                    });
                }
              });
            }).catch((error: any) => console.log('video getPicture error', error));
          }
        }]
      });
      await actionSheet.present();
    } else if (this.platform.is('ios')) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.captureImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Camera);
            this.getImageForIos();
          }
        }, {
          text: this.captureVideoString,
          handler: () => {
            this.captureVideoForIos();
          }
        }, {
          text: this.pickImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Photos);
            this.getImageForIos();
          }
        }, {
          text: this.pickVideoString,
          handler: () => {

            const options: CameraOptions = {
              quality: 50,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              mediaType: this.camera.MediaType.VIDEO,
            };
            this.camera.getPicture(options).then(async (data) => {
              this.showLoadingImage = true;
              this.videoProcesComplete = false;
              this.selectedMediaLoader.push(data);
              this.file.resolveLocalFilesystemUrl(data).then((entry: FileEntry) => {
                entry.file(file => {
                  if ((file.size / 1024 / 1024) > 270) {
                    this.utilServ.presentToast(this.fileSizeLargeString);
                    this.videoProcesComplete = true;
                    this.showCloseBtn = true;
                    this.videoProcesComplete = true;
                    this.selectedMediaLoader.pop();
                    return;
                  } else {
                    const reader = this.getReader();
                    reader.onloadend = () => {
                      const imgBlob = new Blob([reader.result], {
                        type: file.type
                      });

                      this.apiService.uploadTimelineMedia(imgBlob, this.userDetail.id, this.utilServ.getTimeStamp() + ".MOV").
                        subscribe((uploadRes: any) => {
                          if (uploadRes.success === 1) {
                            this.showLoadingImage = false;
                            this.videoProcesComplete = true;
                            this.selectedMediaLoader.pop();
                            this.mediaArray.unshift(uploadRes.message.info);
                            this.checkMediaToUpload();
                          } else {
                            this.showLoadingImage = false;
                            this.videoProcesComplete = true;
                            this.selectedMediaLoader = [];
                            this.utilServ.presentToast(this.uploadMedialErrorString);
                          }
                        });
                    };
                    reader.readAsArrayBuffer(file);
                  }
                });
              });
            }).catch((error: any) => { console.log('videossss error', error) });
          }
        }]
      });
      await actionSheet.present();
    } else if (this.platform.is('desktop')) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.captureImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Camera);
            this.getImageForIos();
          }
        }
          // }, {
          //   text: this.captureVideoString,
          //   handler: () => {
          //     this.captureVideo();
          //   }
          // },
          , {
          text: this.pickImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Photos);
            this.getImageForIos();
          }
        }, {
          text: this.pickVideoString,
          handler: () => {
            this.userInputElementForIos.click();
          }
        }]
      });
      await actionSheet.present();
    }
  }
  getReader() {
    const reader = new FileReader();
    const zoneOriginalInstance = (reader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || reader;
  }
  captureImage() {
    this.nativeLib.captureImage(CameraSource.Camera);
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        this.showLoadingImage = true;
        this.selectedMediaLoader.push(imgData.blob);
        this.apiService.uploadTimelineMedia(imgData.blob, this.userDetail.id, imgData.filename).subscribe((uploadRes: any) => {
          if (uploadRes.success === 1) {
            this.showLoadingImage = false;
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
            this.checkMediaToUpload();
          } else {
            this.showLoadingImage = false;
            this.selectedMediaLoader = [];
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
        this.eventCustom.destroy('imageReady');
        this.checkMediaToUpload();
      }
    });
  }
  captureVideo() {
    this.nativeLib.captureVideo();
    this.eventCustom.subscribe('videoReady', (vidData) => {
      if (vidData) {
        // console.log("videodata", vidData);
        this.showLoadingImage = true;
        this.videoProcesComplete = false;
        this.selectedMediaLoader.push(vidData.blob);
        this.apiService.uploadTimelineMedia(vidData.blob, this.userDetail.id, vidData.filename).subscribe((uploadRes: any) => {
          // console.log('uploadRes', uploadRes);
          if (uploadRes.success === 1) {
            this.showLoadingImage = false;
            this.videoProcesComplete = true;
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
            this.checkMediaToUpload();
          } else {
            this.showLoadingImage = false;
            this.videoProcesComplete = true;
            this.selectedMediaLoader = [];
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
        this.eventCustom.destroy('videoReady');
        this.checkMediaToUpload();
      }
    });
  }
  captureVideoForIos() {
    this.nativeLib.captureVideoForIos();
    this.eventCustom.subscribe('videoReady', (vidData) => {
      if (vidData) {
        this.showLoadingImage = true;
        this.videoProcesComplete = false;
        this.selectedMediaLoader.push(vidData);
        this.apiService.uploadTimelineMedia(vidData, this.userDetail.id, this.utilServ.getTimeStamp() + ".MOV").
          subscribe((uploadRes: any) => {
            // console.log('uploadRes', uploadRes);
            if (uploadRes.success === 1) {
              this.showLoadingImage = true;
              this.videoProcesComplete = true;
              this.selectedMediaLoader.pop();
              this.mediaArray.unshift(uploadRes.message.info);
              this.checkMediaToUpload();
            } else {
              this.showLoadingImage = false;
              this.videoProcesComplete = true;
              this.selectedMediaLoader = [];
              this.utilServ.presentToast(this.uploadMedialErrorString);
            }
          });
        this.eventCustom.destroy('videoReady');
        this.checkMediaToUpload();
      }
    });
  }
  getImageForIos() {
    // this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        this.showLoadingImage = true;
        this.selectedMediaLoader.push(imgData.blob);
        const fileName = (this.utilServ.getTimeStamp()) + ((imgData.webPath).split('/', -1).pop());
        this.apiService.uploadTimelineMedia(imgData.blob, this.userDetail.id, fileName).subscribe((uploadRes: any) => {
          if (uploadRes.success === 1) {
            this.showLoadingImage = false;
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
            this.checkMediaToUpload();
          } else {
            this.showLoadingImage = false;
            this.selectedMediaLoader = [];
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
        this.eventCustom.destroy('imageReady');
        this.checkMediaToUpload();
      }
    });
  }

  pickImageVideoFromDevice(event) {
    const x = { mediaUrl: null, blob: null, filename: null, type: null };
    if (event.target.files && event.target.files[0]) {
      const myFile = event.target.files;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < myFile.length; i++) {
        this.showLoadingImage = true;
        this.selectedMediaLoader.push(myFile[i]);
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < myFile.length; i++) {

        // this.filePath.resolveNativePath(path)
        //   .then(filePath => console.log(filePath))
        //   .catch(err => console.log(err));

        // this.videoEditor.transcodeVideo({
        //   fileUri: '/path/to/input.mov',
        //   outputFileName: 'output.mp4',
        //   outputFileType: VideoEditor.OutputFileType.MPEG4
        // })
        //   .then((fileUri: string) => console.log('video transcode success', fileUri))
        //   .catch((error: any) => console.log('video transcode error', error));


        this.showLoadingImage = true;
        if ((myFile[i].size / 1024 / 1024) > 270) {
          this.utilServ.presentToast(this.fileSizeLargeString);
          this.selectedMediaLoader = [];
          this.showLoadingImage = false;
          return;
        }
        if (myFile[i].type !== 'video/mp4') {
          this.utilServ.presentToast(this.mp4FilesOnlyString);
          this.showLoadingImage = false;
          this.selectedMediaLoader = [];
          return;
        }
        x.blob = new Blob([myFile[i]], { type: myFile[i].type });
        x.filename = myFile[i].name;
        if ((this.imageExtArray.includes(myFile[i].type)) || (this.vidExtArray.includes(myFile[i].type))) {
          x.type = myFile[i].type;
        } else {
          alert(this.mediaTypeNotFoundString);
          this.selectedMediaLoader = [];
          this.showLoadingImage = false;
          return;
        }
        this.apiService.uploadTimelineMedia(x.blob, this.userDetail.id, x.filename).subscribe((uploadRes: any) => {
          if (uploadRes.success === 1) {
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
          } else {
            this.showLoadingImage = false;
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
          this.checkMediaToUpload();
        });
      }
    }
  }

  formateFileName(filename) {
    let nameBeforeSpace: string = (filename.split(' '))[0];
    nameBeforeSpace = nameBeforeSpace.replace(/\s/g, '_');
    nameBeforeSpace = nameBeforeSpace.replace(/\./g, '_');
    const ext = (filename.split('.')).pop();
    const newFileName = this.userDetail.id + '_' + (this.utilServ.getTimeStamp()) + '_' + nameBeforeSpace + '.' + ext;
    return newFileName;
  }
  removeimg(i, Original, thumb) {
    this.apiService.deleteUploadImage(Original, thumb).subscribe((res: any) => {
      this.mediaArray.splice(i, 1);
      this.checkMediaToUpload();
    });
  }
  checkMediaToUpload() {
    if (this.mediaArray.length > 0) {
      this.showPostButton = true;
    } else {
      this.showPostButton = false;
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
  trimString(string, length) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }
  async tagSport() {
    const yesOrNo = true;
    const modal = await this.modalController.create({
      component: SelectSportsOrLagacyComponent,
      componentProps: {
        data: yesOrNo
      }
    });
    modal.onDidDismiss().then(data => {
      if (data.data) {
        // console.log('Data:::', data.data);
        this.tagSportId = data.data.data.id;
        this.tagSportString = data.data.data.sportsName;
        this.tagSportIcon = data.data.data.sportsIcon;
        this.showClose = true;
        this.taggedSportFlag = true;
      }
    });
    return await modal.present();
  }
  closeTag() {
    this.tagSportString = 'Tag sport';
    this.tagSportIcon = 'baseball';
    this.tagSportId = null;
    this.showClose = false;
    this.taggedSportFlag = false;
  }
}
