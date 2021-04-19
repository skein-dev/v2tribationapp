import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from '../../../environments/environment';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { ActivatedRoute } from '@angular/router';
import { AddGroupChatMembersComponent } from 'src/app/components/add-group-chat-members/add-group-chat-members.component';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { Capacitor, Plugins } from '@capacitor/core';

// const { Haptics } = Plugins;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chatArray = [];
  groupChatArray: any[];
  data = [];
  filterGroup = [];
  noLableGroup = [];
  onlineusers: [];
  searchTermGrp: any;
  searchTerm: any;
  checkedsegment;
  peoplesearch = 'people-search.png';
  chatrequesthidden = true;
  chatmessages = [];
  environment: any;
  usersdetail: any;
  profile_img_url: any = '';
  groupArray = [];
  showSearchBar = false;
  blockAccessGetGuardianString = 'Access is restricted, please get an adult guardian for your account';
  minorData;
  regularUser = false;
  noChats = false;
  noGroupChats = false;
  unreadChatArray = false;
  unreadGroupChatArray = false;

  // String
  chatString = 'Chats';
  messageString = 'Message';
  groupString = 'Groups';
  noChatString = 'No Chat';
  mediaString = 'Media';
  searchString = 'Search';
  deleteString = 'Delete';
  cancelString = 'Cancel';
  okString = 'Ok';
  deleteDirectChatsString = 'Are you sure you want to delete this chats?';
  deleteGroupChatsString = 'Are you sure you want to delete this group chats?';
  messageDeletedString = 'Message Deleted!';

  constructor(
    private socket: Socket,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private apiService: ApiService,
    private alertController: AlertController,
    private eventCustom: EventsCustomService,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.params.subscribe(data => {
      this.unreadChatArray = false;
      this.unreadGroupChatArray = false;
      this.utilServ.showLoaderWait();
      this.eventCustom.publish('badgeCount', '');

      if (!this.checkedsegment) { this.checkedsegment = 'directChat'; }
      this.searchTermGrp = '';
      this.searchTerm = '';
      this.usersdetail = JSON.parse(this.utilServ.getUserDetails());
      this.utilServ.checkUserExists();
      this.getLanguageStrings();
      this.usersdetail = JSON.parse(this.utilServ.getUserDetails());

      this.apiService.getUserStatus(this.usersdetail.id).subscribe((res: any) => {
        this.minorData = {
          minor: res.message.isMinor,
          guarded: res.message.isGuardedAthlete
        };
        if (this.minorData.minor === false) {
          this.regularUser = true;
        } else if (this.minorData.minor === true && this.minorData.guarded === false) {
          this.regularUser = false;
          this.checkedsegment = 'directChat';
        } else if (this.minorData.minor === true && this.minorData.guarded === true) {
          this.regularUser = true;
        }
      });
    });
  }
  ngOnInit() {
    this.environment = environment;
    this.socket.on('onlineusers', (data) => {
      if (this.chatArray.length > 0) {
        data.forEach(ele => {
          this.chatArray.forEach(e => {
            if (e.friendid === ele.userid && ele.online === true) {
              e.online = true;
            }
          });
        });
        this.onlineusers = data;
      }
    });
    this.actRouter.params.subscribe(() => {
      this.usersdetail = JSON.parse(this.utilServ.getUserDetails());

      this.socket.on('receive-message', (msg) => {
        this.apiService.connectFuntion();
        this.eventCustom.publish('badgeCount', '');
        this.refreshDirectChat();
        // if (Capacitor.platform !== 'web') { Haptics.vibrate(); }
      });

      this.socket.on('receive-group-message', (data) => {
        this.apiService.connectFuntion();
        this.eventCustom.publish('badgeCount', '');
        this.refreshGroupchat();
        // if (Capacitor.platform !== 'web') { Haptics.vibrate(); }
      });
    });
  }

  ionViewWillEnter() {
    const inter = setInterval(() => {
      if (this.usersdetail) {
        this.refreshGroupchat();
        this.refreshDirectChat();
        clearInterval(inter);
      }
    }, 50);

    localStorage.removeItem('teamData');


  }
  refreshDirectChat() {
    this.apiService.getRecentMessages(this.usersdetail.id).subscribe((res: any) => {
      if (res.message !== 'No Friends') {
        this.chatmessages = res.message;
        this.chatArray = this.chatmessages;
        this.chatArray.forEach(element => {
          if (element.unreaded === 1) {
            this.unreadChatArray = true;
          }
        });
        this.utilServ.hideLoaderWait();
        this.utilServ.hideLoaderWaitAMin();
        this.noChats = false;
      } else {
        this.chatmessages = [];
        this.noChats = true;
        this.utilServ.hideLoaderWait();
        this.utilServ.hideLoaderWaitAMin();
      }
    });
  }

  refreshGroupchat() {
    this.apiService.getGroupChatList(this.usersdetail.id).subscribe((res: any) => {
      if (res.message.length > 0) {
        this.groupArray = res.message;
        this.groupChatArray = this.groupArray;
        this.noGroupChats = false;
        this.groupChatArray.forEach(element => {
          if (element.msgcount !== 0) {
            this.unreadGroupChatArray = true;
          }
        });
        this.utilServ.hideLoaderWait();
        this.utilServ.hideLoaderWaitAMin();
      } else {
        this.noGroupChats = true;
      }

    });
  }

  // OPEN DIRECT CHAT
  chatdetailClick(id) {
    this.eventCustom.publish('badgeCount', '');
    this.utilServ.navChatwithId(id);
  }

  // OPEN GROUP CHAT
  groupchatdetail(data) {
    this.eventCustom.publish('badgeCount', '');
    const x = data;
    x.teamid = data.id;
    localStorage.setItem('teamData', JSON.stringify(x));
    if (data.type === 1) {
      this.utilServ.navGroupChatwithId(data.id);
    } else if (data.type === 2) {
      this.utilServ.navGroupChatwithId(data.gid);
    }
  }

  async createGroup() {
    const modal = await this.modalController.create({
      component: AddGroupChatMembersComponent
    });
    modal.onDidDismiss().then((ref) => {
      this.refreshGroupchat();
    });
    return await modal.present();
  }

  // Search on direct chat
  searchDirChat(x) {
    this.chatArray = this.filterDireChat(this.chatmessages, x || null);
    if (this.chatArray.length === 0) {
      this.showSearchBar = false;
    } else {
      this.showSearchBar = true;
    }
  }

  // search on group
  searchGrp(x) {
    this.groupChatArray = this.filterGrp(this.groupArray, x || null);
  }

  filterDireChat(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.first_name.toLowerCase().includes(terms);
    });
  }

  filterGrp(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.team_name.toLowerCase().includes(terms);
    });
  }

  segmentChanged(ev) {
    this.checkedsegment = ev.detail.value;
  }
  async deleteGroupChats(groupId) {
    const confirm = await this.alertController.create({
      header: this.deleteString + '?',
      cssClass: 'buttonCss',
      message: this.deleteGroupChatsString,
      buttons: [{
        text: this.cancelString,
        role: 'cancel',
      },
      {
        text: this.okString,
        handler: () => {
          this.apiService.deleteGroupChat(this.usersdetail.id, groupId).pipe().subscribe((res: any) => {
            if (res.success === 1) {
              this.utilServ.presentToast(this.messageDeletedString);
              this.groupArray = [];
              this.groupChatArray = [];
              this.refreshGroupchat();
            }
          });
        }
      }
      ]
    });
    confirm.present();
  }
  async deleteChats(fromId) {
    const confirm = await this.alertController.create({
      header: this.deleteString + '?',
      cssClass: 'buttonCss',
      message: this.deleteDirectChatsString,
      buttons: [{
        text: this.cancelString,
        role: 'cancel',
      },
      {
        text: this.okString,
        handler: () => {
          this.apiService.deleteChat(this.usersdetail.id, fromId).pipe().subscribe((res: any) => {
            if (res.success === 1) {
              this.utilServ.presentToast(this.messageDeletedString);
              this.chatArray = [];
              this.refreshDirectChat();
            }
          });
        }
      }
      ]
    });
    confirm.present();

  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.chatString = this.utilServ.getLangByCode('chat');
      this.messageString = this.utilServ.getLangByCode('message');
      this.groupString = this.utilServ.getLangByCode('groups');
      this.noChatString = this.utilServ.getLangByCode('noChatString');
      this.mediaString = this.utilServ.getLangByCode('media');
      this.searchString = this.utilServ.getLangByCode('search');
      this.deleteString = this.utilServ.getLangByCode('delete');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.okString = this.utilServ.getLangByCode('okay');
      this.deleteDirectChatsString = this.utilServ.getLangByCode('deleteDirectChatsString');
      this.deleteGroupChatsString = this.utilServ.getLangByCode('deleteGroupChatsString');
      this.messageDeletedString = this.utilServ.getLangByCode('messageDeletedString');
      this.blockAccessGetGuardianString = this.utilServ.getLangByCode('minor.noGuardian.message');

    }
  }
}
