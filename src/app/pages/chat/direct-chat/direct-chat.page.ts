import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Socket } from 'ngx-socket-io';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { MultimediaViewComponent } from 'src/app/components/multimedia-view/multimedia-view.component';
import { Capacitor, Plugins } from '@capacitor/core';

const { Network } = Plugins;
@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.page.html',
  styleUrls: ['./direct-chat.page.scss'],
})
export class DirectChatPage implements OnInit {
  @ViewChild('content') content: any;
  // @ViewChild('content', { read: IonContent, static: false }) content: IonContent;
  @ViewChild('myStyle') recentTagHtml: any;
  @ViewChild('messageToSendBox') messageBox;
  loadMoreFlag = false;
  socket: any;
  chatInput = '';
  chatdata: any;
  usersdetail: any;
  chatUserId: any;
  data: any;
  environment: any;
  data1: any;
  imagearray = [];
  chats = {};
  imageurls = [];
  offset = 0;
  limit = 20;
  scrollMax = 800;
  lastname: any;
  senderprofileinfo: any;
  profilePicUrl: any;
  profilename: any = '';
  noData = false;
  yesterday: any;
  today: any;
  chatArray = [];
  showButton = false;
  reverseRefresh = false;
  onlineMode = false;
  volumeOff = false;
  volumeOn = true;
  limitReached = false;
  onDirectChatPage = '1';
  totalChats: any;
  showLoadingImage = false;
  sentValue = 1;

  count: any = '0';
  curruntPageValue;

  // String
  saySomethingString = 'Say something...';
  noConversationsString = 'No Conversations';
  todayString = 'Today';
  yesterdayString = 'Yesterday';
  daysAgoString = '%X day(s) ago';
  minAgoString = '%X minute(s) ago';
  hoursAgoString = '%X hour(s) ago';
  weekAgoString = '%X week(s) ago';
  monthAgoString = '%X month(s) ago';
  yearAgoString = '%X year(s) ago';
  dayAgoString = '%X day(s) ago';
  minsAgoString = 'a minutes ago';
  hourAgoString = 'An hour ago';
  weeksAgoString = '%X week(s) ago';
  monthsAgoString = '%X month(s) ago';
  yearsAgoString = '%X year(s) ago';
  dateString = 'Date';
  fewSecAgoString = 'a few seconds ago';
  aDayAgoString = '%X day(s) ago';
  anHourAgoString = 'An hour ago';
  anHoursAgoString = '%X hour(s) ago';
  takePhotoString = 'Take photo';
  chooseImage = 'Choose image';
  volumeStatus = 'Volume';
  blockAccessGetGuardianString = 'Access is restricted, please get an adult guardian for your account';

  constructor(
    private socketAPI: Socket,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService,
    private router: Router,
    private nativeLib: DeviceNativeApiService,
    private eventCustom: EventsCustomService,
    private apiService: ApiService,
    private location: Location,
    private platform: Platform,
    private modalcontrolller: ModalController) {
    this.actRouter.params.subscribe(data => {

      this.curruntPageValue = JSON.parse(localStorage.getItem('currentLocation'));
      let handler = Network.addListener('networkStatusChange', (status) => {
      });
      this.chatArray = [];
      this.chatUserId = data.id;
      this.usersdetail = JSON.parse(this.utilServ.getUserDetails());
      this.offset = 0;
      this.limit = 20;
      this.getChatDetails(this.chatUserId, '');
      this.setMessageReadFlag(this.usersdetail.id, this.chatUserId);
      this.socketAPI.emit('messageStatusUpdate', { status: 3, fromid: this.chatUserId, toid: this.usersdetail.id });
      this.eventCustom.publish('badgeCount', '');
      this.data1 = '';
      this.getLanguageStrings();


      this.socketAPI.on('messageUpdate', (res) => {
        setTimeout(() => {
          if (res.fromid == this.usersdetail.id) {
            this.chatArray.forEach(element => {
              element.messages.forEach(subEle => {
                if (res.status > subEle.status) {
                  subEle.status = res.status;
                }
              });
            });
          } else if (res.update) {
            this.chatArray.forEach(element => {
              element.messages.forEach(subEle => {
                if (res.status > subEle.status) {
                  subEle.status = res.status;
                }
              });
            });
          }
        }, 1000);
      });
    });
    this.soketRecive();
  }
  soketRecive() {
    this.socketAPI.connect();
    this.apiService.connectFuntion();
    this.socketAPI.on('receive-message', (msg) => {
      this.curruntPageValue = JSON.parse(localStorage.getItem('currentLocation'));

      if (msg.error === "Access restricted for minors") {
        this.utilServ.okButtonMessageAlert(this.blockAccessGetGuardianString);
      }
      this.socketAPI.connect();
      if (JSON.stringify(msg.userinfo.from_id) === this.chatUserId
        || JSON.stringify(msg.userinfo.from_id) === JSON.stringify(this.usersdetail.id) ||
        JSON.stringify(msg.userinfo.id) === JSON.stringify(this.usersdetail.id)
        || JSON.stringify(msg.userinfo.from_id) === this.chatUserId
        || JSON.stringify(msg.userinfo.id) === this.chatUserId) {
        this.apiService.connectFuntion();
        this.offset = 0;
        this.limit = 1;
        this.reverseRefresh = true;
        // if (Capacitor.platform !== 'web') { Haptics.vibrate(); }
        this.getChatDetails(this.chatUserId, 'true');
        // setTimeout(() => {
        this.scrollToBottomOnInit();
        // }, 550);
        if (this.curruntPageValue === "/chat/direct-chat/" + this.chatUserId) {
          this.setMessageReadFlag(this.usersdetail.id, this.chatUserId);
          if (msg.userinfo.from_id !== this.usersdetail.id) {
            this.socketAPI.emit('messageStatusUpdate', { status: 3, fromid: this.chatUserId, toid: this.usersdetail.id, msgid: msg.id });
          }
        } else {
          if (msg.userinfo.from_id !== this.usersdetail.id) {
            this.socketAPI.emit('messageStatusUpdate', { status: 2, fromid: this.chatUserId, toid: this.usersdetail.id, msgid: msg.id });
          }
        }
      }

    });
  }
  ngOnInit() {
    this.environment = environment;
  }

  ionViewWillEnter() {
    this.apiService.connectFuntion();
    this.today = new Date().toISOString().slice(0, 10);
    this.yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    this.apiService.getUserBaseInfoByUserId(this.chatUserId, this.chatUserId).subscribe((res: any) => {
      this.senderprofileinfo = res.message;
      this.profilename = this.senderprofileinfo.baseInfo.first_name + ' ' + this.senderprofileinfo.baseInfo.last_name;
      this.profilePicUrl = this.senderprofileinfo.baseInfo.profile_img_url_thump;
    },
      error => {
        console.log(error);
      });

    setTimeout(() => {
      this.content.scrollToPoint(0, 99999999999999999999999999999999999999, 300);
    }, 1000);
    // setTimeout(() => {
    //   this.messageBox.setFocus();
    // }, 100);
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
    this.scrollToBottomOnInit();
  }

  async presentActionSheet() {
    this.imagearray = [];
    this.imageurls = [];
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        this.showLoadingImage = true;
        // tslint:disable-next-line: prefer-for-of
        this.apiService.chatimgupload(imgData.blob, this.usersdetail.id, imgData.reqPath).subscribe((data: any) => {
          this.showLoadingImage = false;

          this.data1 = { original: data.message.original, thumbnail: data.message.thumbnail };
          this.imageurls.push(this.data1);
          this.imagearray.push(imgData.webPath);
        },
          (error: any) => {
            console.log('Error in select media section ::', error);
          });
        this.eventCustom.destroy('imageReady');
      }
    });
  }

  removeimg(i) {
    if (i > -1) {
      this.imageurls.splice(i, 1);
      this.imagearray.splice(i, 1);
    }
  }

  volumeControl(value) {
    if (value === '2') {
      this.volumeOff = true;
      this.volumeOn = false;
      localStorage.setItem('volumeControl', '2');
    }
    if (value === '1') {
      this.volumeOn = true;
      this.volumeOff = false;
      localStorage.setItem('volumeControl', '1');
    }
  }

  getChatDetails(otherid, value) {
    this.apiService.getChatHistory(this.usersdetail.id, otherid, this.offset, this.limit).subscribe((res: any) => {
      this.totalChats = res.message.meta.total;
      const newMessages = res.message.content;
      // tslint:disable-next-line: forin
      for (const date in newMessages) {
        this.count = +this.count + +newMessages[date].length;
        if (value === 'true') {
          this.chatArray.push({ date, messages: newMessages[date].reverse() });
          setTimeout(() => {
            this.content.scrollToBottom(50);
          }, 200);
        } else {
          this.chatArray.unshift({ date, messages: newMessages[date].reverse() });
        }
      }
      if (this.count >= this.totalChats) {
        this.limitReached = true;
      }
    });

  }
  loadMoreMessage(e) {
    if (this.loadMoreFlag === true) {
      if (this.totalChats > 20) {
        if (this.limitReached === false) {
          this.offset += 20;
          this.limit = 20;
          this.getChatDetails(this.chatUserId, '');
        } else {
        }
      } else {
        this.showButton = false;
      }
    }
    setTimeout(() => {
      e.target.complete();
    }, 100);
  }
  async sendMessageFun(mssage) {
    if (mssage !== '' || this.data1 !== '') {
      const msg = this.formatString(mssage);
      let status = await Network.getStatus();
      if (status.connected === true) {
        this.sentValue = 1
      } else {
        this.sentValue = 0
      }
      if (mssage !== '' && this.data1 === '' && msg !== undefined) {
        this.data = {
          partner: this.chatUserId,
          message: {
            userinfo: {
              id: this.usersdetail.id,
              imgurl: this.usersdetail.profile_img_url,
              name: this.usersdetail.first_name
            },
            content: msg,
            media_url: '',
            date: new Date(),
            calltype: 'out',
            type: 'txt',
            sent: this.sentValue
          }
        };
        this.socketAPI.connect();
        this.socketAPI.emit('send-message', this.data);
        this.chatInput = '';
      } else if (this.data1 !== '') {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.imageurls.length; i++) {
          this.dateString = moment(new Date()).format('LT');
          this.chatdata = {
            partner: this.chatUserId,
            message: {
              content: msg || null,
              media_url: this.imageurls[i].original,
              media_url_thumb: this.imageurls[i].thumbnail,
              date: new Date(),
              type: 'media',
              sent: this.sentValue,
              userinfo: {
                id: this.usersdetail.id,
                imgurl: this.usersdetail.profile_img_url,
                name: this.usersdetail.first_name,
              },
            }
          };
          this.socketAPI.connect();
          this.socketAPI.emit('send-image-to-server', this.chatdata);
        }
        this.imagearray = [];
        this.imageurls = [];
        this.chatInput = '';
        this.data1 = '';
      }
    }
    this.messageBox.setFocus();
    this.content.scrollToBottom(50);
  }
  back() {
    this.onDirectChatPage = '0';
    this.utilServ.navMainChat();
  }

  async openMultiMedia(fullAsserts, i, fromid) {
    const list = [{ asset_url: `message/${fromid}/${fullAsserts}`, post_type: 'image', asset_type: 'image' }];
    const xDx = {
      asserts: list,
      currentIndex: 0
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

  friendDetail(id) {
    localStorage.setItem('routingProfile', 'true');
    this.router.navigate([`profile/${id}`]);
  }
  formatString(strng) {
    return this.utilServ.formatString(strng);
  }
  openKeyboard() {
    this.utilServ.showKeyBoard();
    if (this.platform.is('android')) {
      setTimeout(() => {
        this.content.scrollToPoint(0, 99999999999999999999999999999999999999, 300);
      }, 1000);
    }


  }
  setMessageReadFlag(myUserId, chatUserId) {
    this.apiService.setReadMessageFlag(myUserId, chatUserId).subscribe((res: any) => {
    });
  }
  checkIfChatsExist() {
    if (this.totalChats !== 0) {
      this.noData = false;
    } else {
      this.noData = true;
    }
  }

  logScrolling(event) {
    if (this.totalChats > 20) {
      if (this.scrollMax < event.detail.scrollTop) {
        this.scrollMax = event.detail.scrollTop;
      }
      if (event.detail.scrollTop > (this.scrollMax - 550)) {
        // this.showButton = false;
      }
      else {
        this.showButton = true;
      }
    }
  }
  scrollToBottomOnInit() {
    this.loadMoreFlag = false;
    setTimeout(() => {
      this.content.scrollToBottom(50);
      this.showButton = false;
      this.loadMoreFlag = true;
    }, 1000);
  }
  scrollToBottomOnInitFab() {
    this.loadMoreFlag = false;
    setTimeout(() => {
      this.content.scrollToBottom(50);
      this.showButton = false;
      this.loadMoreFlag = true;
    }, 1000);



  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.saySomethingString = this.utilServ.getLangByCode('say_something');
      this.noConversationsString = this.utilServ.getLangByCode('no_conversations');
      this.todayString = this.utilServ.getLangByCode('today');
      this.yesterdayString = this.utilServ.getLangByCode('yesterday');
      this.daysAgoString = this.utilServ.getLangByCode('day_ago');
      this.minAgoString = this.utilServ.getLangByCode('min_ago');
      this.hoursAgoString = this.utilServ.getLangByCode('an_hours_ago');
      this.weekAgoString = this.utilServ.getLangByCode('week_ago');
      this.monthAgoString = this.utilServ.getLangByCode('month_ago');
      this.yearAgoString = this.utilServ.getLangByCode('year_ago');
      this.dayAgoString = this.utilServ.getLangByCode('a_day_ago');
      this.minsAgoString = this.utilServ.getLangByCode('a_minutes_ago');
      this.hourAgoString = this.utilServ.getLangByCode('an_hours_ago');
      this.weeksAgoString = this.utilServ.getLangByCode('week_ago');
      this.monthsAgoString = this.utilServ.getLangByCode('month_ago');
      this.yearsAgoString = this.utilServ.getLangByCode('year_ago');
      this.dateString = this.utilServ.getLangByCode('date');
      this.fewSecAgoString = this.utilServ.getLangByCode('a_few_sec_ago');
      this.aDayAgoString = this.utilServ.getLangByCode('day_ago');
      this.anHourAgoString = this.utilServ.getLangByCode('an_hour_ago');
      this.anHoursAgoString = this.utilServ.getLangByCode('hours_ago');
      this.takePhotoString = this.utilServ.getLangByCode('take_photo');
      this.chooseImage = this.utilServ.getLangByCode('choose_image');
      this.volumeStatus = this.utilServ.getLangByCode('volumeStatus');
      this.blockAccessGetGuardianString = this.utilServ.getLangByCode('minor.noGuardian.message');
    }
  }
}
