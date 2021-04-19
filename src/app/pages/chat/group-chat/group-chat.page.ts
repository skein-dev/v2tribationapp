import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
// import { Network } from '@ionic-native/network/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { AboutTeamComponent } from 'src/app/components/about-team/about-team.component';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { AboutGroupChatComponent } from '../../../components/about-group-chat/about-group-chat.component';
import { MultimediaViewComponent } from 'src/app/components/multimedia-view/multimedia-view.component';
import { Capacitor, Plugins } from '@capacitor/core';
// const { Haptics } = Plugins;
const { Network } = Plugins;

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
})

export class GroupChatPage implements OnInit {

  @ViewChild('messageToSendBox') messageBox;
  @ViewChild('content') private content: any;
  @ViewChild('myStyle') recentTagHtml: any;


  chatInput: any = '';
  imageurls = [];
  imagearray = [];
  userDetail: any;
  onlineMode: boolean;
  environment: any;
  limit = 20;
  offset = 0;
  reverseRefresh = false;
  groupDetails: any;
  groups: any;
  groupChatArray = [];
  today: any;
  yesterday: any;
  groupId: any;
  teamPic: any = '';
  adminDetail: any;
  groupCreated: any;
  masteradminid: any;
  showButton = false;
  onGroupChatPage = '1';
  data1;
  totalChats = 0;
  chats = {};
  limitReached = false;
  scrollMax = 800;
  count: any = '0';
  showLoadingImage = false;
  sentValue = 1;
  curruntPageValue;




  // String
  todayString = 'Today';
  yesterdayString = 'Yesterday';
  failed: 'Failed';
  fileNotSupported: 'File not supported';
  leftGrpString = '%X has left';
  groupChatRemoved = ' removed';
  joinedGrpString = 'joined';
  groupChatCreated: any = '%X created group %Y';
  groupMembString = '';
  teamName = '';
  youString = 'You';
  takePhoto = 'Take Photo';
  chooseImage = 'Choose Image';
  saySomethingString = 'Say something...';

  constructor(
    private utilServ: GenralUtilsService,
    private apiService: ApiService,
    // private network: Network,
    private modalController: ModalController,
    private actRouter: ActivatedRoute,
    private nativeLib: DeviceNativeApiService,
    private socket: Socket,
    private platform: Platform,
    private modalcontrolller: ModalController,
    private eventCustom: EventsCustomService) {
    this.eventCustom.publish('badgeCount', '');

    this.today = moment(new Date()).format('YYYY-MM-DD');
    const tempDate = moment().subtract(1, 'days');
    this.yesterday = moment(tempDate).format('YYYY-MM-DD');

    this.actRouter.params.subscribe(async (res: any) => {
      this.groupChatArray = [];
      this.curruntPageValue = JSON.parse(localStorage.getItem('currentLocation'));

      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.groupDetails = JSON.parse(localStorage.getItem('teamData'));
      this.getGroupChat();
      this.getChatHistory('');
      this.socket.emit('grpmessageStatusUpdate', { userid: this.userDetail.id, readall: true, grpid: this.groupId });
      this.socket.on('grpmessageUpdate', (res) => {
        setTimeout(() => {
          // if(res.fromid == this.usersdetail.id){
          this.groupChatArray.forEach(element => {
            element.messages.forEach(subEle => {
              if (res.status > subEle.msg_status) {
                subEle.msg_status = res.status;
              }
            });
          });
          // }else if(res.update){
          //   this.chatArray.forEach(element => {
          //     element.messages.forEach(subEle => {
          //       if(res.status > subEle.status){
          //         subEle.status = res.status ;
          //       }
          //   });
          // });
          // }
        }, 1000);
      });
      this.apiService.groupMessageReadUpdate(this.userDetail.id, this.groupId, this.groupDetails.type).subscribe((data: any) => { });
      this.socket.on('receive-group-message', (data) => {
        // this.socket.emit('grpmessageStatusUpdate', { status: 2, userid: this.userDetail.id, msgid: data.id, rcv : true });

        this.curruntPageValue = JSON.parse(localStorage.getItem('currentLocation'));

        this.offset = 0;
        this.limit = 1;
        this.reverseRefresh = true;
        this.getChatHistory('true');
        // if (Capacitor.platform !== 'web') { Haptics.vibrate(); }
        setTimeout(() => {
          this.scrollToBottomOnInit();
        }, 550);
        if (this.curruntPageValue === "/chat/group-chat/" + this.groupId) {
          this.apiService.groupMessageReadUpdate(this.userDetail.id, this.groupId, this.groupDetails.type)
            .subscribe((response: any) => { });
          if (data.message.userinfo.from_id !== this.userDetail.id) {
            // this.socket.emit('grpmessageStatusUpdate', { status: 2, userid: this.userDetail.id, msgid: data.id, rcv : true });
            this.socket.emit('grpmessageStatusUpdate', { status: 2, userid: this.userDetail.id, msgid: data.id, read: true });
          }
        } else {
          if (data.message.userinfo.from_id !== this.userDetail.id) {
            this.socket.emit('grpmessageStatusUpdate', { status: 2, userid: this.userDetail.id, msgid: data.id, rcv: true });
          }
        }
      });
      this.getLanguageStrings();
      let handler = Network.addListener('networkStatusChange', (status) => {
      });
      let status = await Network.getStatus();
      if (status.connected === true) {
        this.onlineMode = true;
      } else {
        this.onlineMode = false;
      }
    });
  }
  ngOnInit() {
    this.environment = environment;
  }
  ionViewWillEnter() {
    // setTimeout(() => {
    //   this.scrollToBottomOnInit();
    // }, 550);
    // setTimeout(() => {
    //   this.messageBox.setFocus();
    // }, 100);
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.scrollToBottomOnInit();
    }, 250);
  }

  async presentActionSheet() {
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        this.showLoadingImage = true;
        // tslint:disable-next-line: prefer-for-of
        this.apiService.chatimgupload(imgData.blob, this.userDetail.id, imgData.reqPath).subscribe((data: any) => {
          this.showLoadingImage = false;

          this.data1 = { original: data.message.original, thumbnail: data.message.thumbnail };
          this.imageurls.push(this.data1);
          this.imagearray.push(imgData.webPath);
        },
          (error: any) => {
            // console.log('Error in select media section ::', error);
          });
        this.eventCustom.destroy('imageReady');
      }
    });
  }

  async sendMessageFun(message) {
    // For text messages
    if (message !== '' || this.imageurls !== ['']) {
      const msg = this.formatString(message);
      let status = await Network.getStatus();
      if (status.connected === true) {
        this.sentValue = 1
      } else {
        this.sentValue = 0
      }
      if (message !== '' && this.imageurls.length === 0) {
        const data = {
          message: {
            group_id: this.groupId,
            group_type: this.groupDetails.type,
            group_name: this.teamName,
            msg_type: 0,
            content: msg,
            media: '',
            userinfo: { from_id: this.userDetail.id, name: this.userDetail.first_name },
            sent: this.sentValue
          }
        };
        if (data) {
          this.chatInput = '';
        }
        this.socket.emit('send-group-message', data);
        // For Images
      } else if (this.imageurls !== ['']) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.imageurls.length; i++) {
          const data = {
            message: {
              group_id: this.groupId,
              group_type: this.groupDetails.type,
              group_name: this.teamName,
              msg_type: 1,
              content: msg || null,
              media: this.imageurls[i].original,
              media_url_thumb: this.imageurls[i].thumbnail,
              userinfo: { from_id: this.userDetail.id, name: this.userDetail.first_name },
              sent: this.sentValue
            }
          };
          this.socket.emit('send-group-image-to-server', data);
        }
        this.imageurls.length = 0;
        this.imagearray.length = 0;
        this.chatInput = '';
      }
    }
    this.messageBox.setFocus();
    this.content.scrollToBottom(50);

  }

  logScrolling(event) {
    if (this.totalChats > 20) {
      if (this.scrollMax < event.detail.scrollTop) {
        this.scrollMax = event.detail.scrollTop;
      }
      if (event.detail.scrollTop > (this.scrollMax - 550)) {
        this.showButton = false;
      }
      else {
        this.showButton = true;
      }
    }
  }


  scrollToBottomOnInit() {
    this.content.scrollToBottom(50);
  }

  removeimg(i) {
    if (i > -1) {
      this.imageurls.splice(i, 1);
      this.imagearray.splice(i, 1);
    }
  }


  async groupDetail() {
    if (this.groupDetails.type === 2) {
      const modal = await this.modalController.create({
        component: AboutGroupChatComponent
      });
      modal.onDidDismiss().then((ref) => {
        if (ref.data.data === 0) {
          this.groupDetails = JSON.parse(localStorage.getItem('teamData'));
          this.getGroupChat();
        }
      });
      return await modal.present();
    } else if (this.groupDetails.type === 1) {
      const modal = await this.modalController.create({
        component: AboutTeamComponent,
      });
      modal.onDidDismiss().then((ref) => {
        if (ref.data.data === 0) {
          this.groupDetails = JSON.parse(localStorage.getItem('teamData'));
          this.getGroupChat();
        }
      });
      return await modal.present();
    }
  }

  back() {
    this.onGroupChatPage = '0';
    localStorage.removeItem('teamData');
    this.utilServ.navMainChat();
  }

  formatString(strng) {
    return this.utilServ.formatString(strng);
  }

  getGroupChat() {
    if (this.groupDetails.type === 1) {
      this.groupId = this.groupDetails.id;
      this.apiService.getTeamDataById(this.groupId).subscribe((res: any) => {
        this.teamPic = res.message[0].team_pic_small;
        this.teamName = res.message[0].team_name;
        this.masteradminid = res.message[0].masteradminid;
        this.getGroupCreatedBy(this.masteradminid);
      });
    }
    if (this.groupDetails.type === 2) {
      this.groupId = this.groupDetails.gid;
      this.apiService.getgroupchatdatabyId(this.groupId).subscribe((res: any) => {
        this.teamPic = res.message[0].profile_bg_img;
        this.teamName = res.message[0].group_name;
        this.masteradminid = res.message[0].group_master;
        this.getGroupCreatedBy(this.masteradminid);
      });
    }
    this.getGroupTeamMember();
  }
  getGroupCreatedBy(adminId) {
    if (adminId !== this.userDetail.id) {
      this.apiService.getUserBaseInfoByUserId(adminId, adminId).subscribe((res: any) => {
        this.adminDetail = res.message.baseInfo;
        this.groupCreated = this.groupChatCreated.replace(/%X/g, this.adminDetail.first_name).replace(/%Y/g, this.teamName);
      });
    } else {
      this.groupCreated = this.groupChatCreated.replace(/%X/g, this.youString).replace(/%Y/g, this.teamName);
    }
  }
  getGroupTeamMember() {
    if (this.groupDetails.type === 1) {
      this.apiService.getTeamMembers(this.groupId).subscribe((res: any) => {
        const tempMembers = res.message;
        const tempMemArray = [];
        tempMembers.forEach(member => {
          if (member.userid === this.userDetail.id) {
            tempMemArray.unshift(this.youString);
          } else {
            if (member.member_accepted === '1') {
              tempMemArray.push(member.first_name);
            }
          }
        });
        this.groupMembString = tempMemArray.join();
      });
    }
    if (this.groupDetails.type === 2) {
      this.apiService.getGroupchatMembers(this.groupId).subscribe((res: any) => {
        const tempMembers = res.message;
        const tempMemArray = [];
        tempMembers.forEach(member => {
          if (member.userid === this.userDetail.id) {
            tempMemArray.unshift(this.youString);
          } else {
            if (member.member_accepted === '1') {
              tempMemArray.push(member.first_name);
            }
          }
        });
        this.groupMembString = tempMemArray.join();
      });
    }
  }

  getChatHistory(value) {
    this.apiService.getGroupChatHistroy(this.userDetail.id, this.groupId, this.offset, this.limit,
      this.groupDetails.type).subscribe((res: any) => {
        this.totalChats = res.message.meta.total;
        const newMessages = res.message.content;
        for (const date in newMessages) {
          this.count = +this.count + +newMessages[date].length;
          if (value === 'true') {
            this.groupChatArray.push({ date, messages: newMessages[date].reverse() });
          } else {
            this.groupChatArray.unshift({ date, messages: newMessages[date].reverse() });
          }
        }
        if (this.count >= this.totalChats) {
          this.limitReached = true;
        }
        // Object.keys(this.chats).forEach((date) => {
        //   this.chats[date] = this.reverseRefresh
        //     ? [...(this.chats[date]), ...(newMessages[date] || [])]
        //     : [...(newMessages[date] || []), ...(this.chats[date])];
        //   delete newMessages[date];
        // });
        // this.chats = Object.assign(newMessages, this.chats);
        // this.groupChatArray = [];

        // // tslint:disable-next-line: forin
        // for (const date in this.chats) {
        //   this.groupChatArray.unshift({ date, messages: this.chats[date] });
        // }
        // this.groupChatArray.sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);
        // this.groupChatArray.forEach(ele => {
        //   this.count = this.count + ele.messages.length;

        //   if (ele.date === this.today) {
        //     ele.date = this.todayString;
        //   }
        //   if (ele.date === this.yesterday) {
        //     ele.date = this.yesterdayString;
        //   }
        // });
        // this.reverseRefresh = false;
        // if (this.count >= this.totalChats ){
        //   this.limitReached = true;
        // }

      });
  }
  loadMoreMessage(e) {
    if (this.totalChats > 20) {
      if (this.limitReached === false) {
        this.offset += 20;
        this.limit = 20;
        this.getChatHistory('');
      } else {
      }
    } else {
    }
    setTimeout(() => {
      e.target.complete();
    }, 10);
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
  openKeyboard() {
    this.utilServ.showKeyBoard();
    if (this.platform.is('android')) {
      setTimeout(() => {
        this.content.scrollToPoint(0, 99999999999999999999999999999999999999, 300);
      }, 1000);
    }
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.saySomethingString = this.utilServ.getLangByCode('say_something');
      this.todayString = this.utilServ.getLangByCode('today');
      this.yesterdayString = this.utilServ.getLangByCode('yesterday');
      this.chooseImage = this.utilServ.getLangByCode('choose_image');
      this.failed = this.utilServ.getLangByCode('failed');
      this.fileNotSupported = this.utilServ.getLangByCode('file_not_supported');
      this.leftGrpString = this.utilServ.getLangByCode('group_chat_left');
      this.groupChatRemoved = this.utilServ.getLangByCode('group_chat_removed').replace(/%X/g, '');
      this.joinedGrpString = this.utilServ.getLangByCode('group_chat_join').replace(/%X/g, '');
      this.groupChatCreated = this.utilServ.getLangByCode('group_chat_created');
      this.youString = this.utilServ.getLangByCode('you');
      this.takePhoto = this.utilServ.getLangByCode('take_photo');
    }
  }
}
