import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';
import { AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { EventsCustomService } from '../../services/events-custom.service';
import { GuardianTermsComponent } from 'src/app/components/guardian-terms/guardian-terms.component';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  // Strings
  requestsString = 'Requests';
  noRequestsString = 'No Requests';
  friendReqString = 'Friend';
  groupChatReqString = 'Group Chat';
  teamReqString = 'Team';
  guardianReqString = 'Guardian';
  searchString = 'Search';
  teamNameString = 'Team Name';
  acceptString = 'Accept';
  deleteString = 'Delete';
  cancelString = 'Cancel';
  okString = 'Ok';
  acceptFrndReqString = 'Are you sure you want to accept friend request?';
  deleteFrndReqString = 'Are you sure you want to reject the friend request?';
  acceptTeamReqString = 'Are you sure you want to accept team request?';
  deleteTeamReqString = 'Are you sure you want to reject the team request?';
  acceptGrpReqString = 'Are you sure you want to accept group request?';
  deleteGrpReqString = 'Are you sure you want to reject the group request?';
  noFriendReqString = 'No friend request';
  noTeamReqString = 'No team request';
  noGrpReqString = 'No group request';
  noGuardReqString = 'No guardian request';
  pendingString = 'Pending';

  searchFriendsTerm;
  searchTeamTerm;
  searchGrpChatTerm;
  searchGuardReqTerm;


  noRequest: any;
  environment: any;

  data: any;
  usersdetail: any;
  checkedsegment = 'friend';

  friendRequests: any[] = [];
  teamRequests: any[] = [];
  groupChatRequests: any[] = [];
  guardianRequests: any[] = [];

  friendReqList: any[] = [];
  teamReqList: any[] = [];
  groupReqList: any[] = [];
  guardianReqList: any[] = [];

  totalReqCount: any;
  userStatus;
  isMinor = false;
  isPending = true;
  isGuarded = false;
  showGuardData = false;
  blockAccessGetGuardianString = 'Access is restricted, please get an adult guardian for your account';
  minorData;
  regularUser = false;

  unreadFrndReq
  unreadTeamReq
  unreadGrpReq

  constructor(
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private modalController: ModalController,
    private utilServ: GenralUtilsService,
    private socket: Socket,
    private router: Router,
    private eventCustom: EventsCustomService,
    private alertController: AlertController) {
    this.actRouter.params.subscribe(data => {
      this.getLanguageStrings();



      this.totalReqCount = 0;
      this.usersdetail = JSON.parse(this.utilServ.getUserDetails());
      this.getuserStatus();
      // Read Requests
      this.apiService.seenRequests(this.usersdetail.id).subscribe((res: any) => {
        if (res.message) {
          this.eventCustom.publish('badgeCount', res);
        }
      });
      // Friend Request
      this.socket.on('send-friend-request', (res) => {
        this.getFriendReq();
        this.checkReqExist();
        this.onRequestPage();
        this.eventCustom.publish('badgeCount', res);
        if (this.checkedsegment !== 'friend') {
          this.unreadFrndReq = true;
        }
      });
      this.socket.on('cancel-friend-request', (res) => {
        this.eventCustom.publish('badgeCount', res);
        this.getFriendReq();
        this.checkReqExist();
        this.unreadFrndReq = false;
      });

      // Team Request
      this.socket.on('invite-team-member', (res) => {
        this.eventCustom.publish('badgeCount', res);
        this.getTeamReq();
        this.checkReqExist();
        if (this.checkedsegment !== 'team') {
          this.unreadTeamReq = true;
        }
      });
      this.socket.on('remove-team-user-invite', (res) => {
        this.unreadTeamReq = false;
        this.eventCustom.publish('badgeCount', res);
        this.getTeamReq();
        this.checkReqExist();

      });

      // Group chat Request
      this.socket.on('invite-groupchat-member', (res) => {
        this.eventCustom.publish('badgeCount', res);
        this.getGrpChatReq();
        this.checkReqExist();
        if (this.checkedsegment !== 'groupChat') {
          this.unreadGrpReq = true;
        }
      });
      this.socket.on('remove-groupchat-user-invite', (res) => {
        this.unreadGrpReq = false;
        this.eventCustom.publish('badgeCount', res);
        this.getGrpChatReq();
        this.checkReqExist();
      });

      // Guardian Request
      this.socket.on('guardian-receive-request', (res) => {
        // alert('in request');
        if (res) {
          if (this.userStatus.isMinor === true) {
            this.isMinor = true;
            this.guardianReqList = [];
            this.guardianRequests = [];
            this.getGuardianReqAsAthlete();
          } else {
            this.isMinor = false;
            this.getGuardianReqAsGuardian();
          }
        }
      });

      this.socket.on('guardian-accept-request', (res) => {
        setTimeout(() => {
          this.userStatus = JSON.parse(localStorage.getItem('userStatus'));
          if (this.userStatus) {
            if (res) {
              if (this.userStatus.isMinor === true) {
                this.isMinor = true;
                this.guardianReqList = [];
                this.guardianRequests = [];
                this.getGuardianReqAsAthlete();
              } else {
                this.isMinor = false;
                this.getGuardianReqAsGuardian();
              }
            }
            if (this.userStatus.isGuardedAthlete === true) {
              this.showGuardData = true;
            }
          }
        }, 500);
      });

      this.socket.on('guardian-reject-request', (res) => {
        // alert("reject request");
        if (res) {
          if (this.userStatus.isMinor === true) {
            this.isMinor = true;
            this.getGuardianReqAsAthlete();
          } else {
            this.isMinor = false;
            this.getGuardianReqAsGuardian();
          }
        }
      });
    });

    this.socket.on('guardian-cancel-request', (res) => {
      // alert("req cancewl");
      if (res) {
        if (this.userStatus.isMinor === true) {
          this.isMinor = true;
          this.getGuardianReqAsAthlete();
        } else {
          this.isMinor = false;
          this.getGuardianReqAsGuardian();
        }
      }
    });
    this.socket.on('guardian-cancel-link', (res) => {
      // alert("xcfszd");
      if (res) {
        this.showGuardData = false;
        if (res) {
          if (this.userStatus.isMinor === true) {
            this.isMinor = true;
            this.getGuardianReqAsAthlete();
          } else {
            this.isMinor = false;
            this.getGuardianReqAsGuardian();
          }
        }
      }
    });
  }
  ionViewWillEnter() {
    this.usersdetail = JSON.parse(this.utilServ.getUserDetails());
    const inter = setInterval(() => {
      if (this.usersdetail) {
        this.getFriendReq();
        this.getTeamReq();
        this.getGrpChatReq();
        // this.getGuardianReqAsGuardian();
        // this.getGuardianReqAsAthlete();
        this.checkReqExist();
        this.getuserStatus();
        clearInterval(inter);
      }
    }, 500);
    this.utilServ.getUserStatus(this.usersdetail.id);

    this.apiService.getUserStatus(this.usersdetail.id).subscribe((res: any) => {
      this.minorData = {
        minor: res.message.isMinor,
        guarded: res.message.isGuardedAthlete
      };
      if (this.minorData.minor === false) {
        this.regularUser = true;
      } else if (this.minorData.minor === true && this.minorData.guarded === false) {
        this.regularUser = false;
        this.checkedsegment = 'guardian';
        // console.log('hi minor');
      } else if (this.minorData.minor === true && this.minorData.guarded === true) {
        this.regularUser = true;
      }
    });
  }
  ngOnInit() {
    this.environment = environment;
  }
  segmentChanged(ev) {
    this.checkedsegment = ev.detail.value;
    if (this.checkedsegment === "friend") {
      this.unreadFrndReq = false;
    }
    if (this.checkedsegment === "team") {
      this.unreadTeamReq = false;
    }
    if (this.checkedsegment === "groupChat") {
      this.unreadGrpReq = false;
    }
  }
  getFriendReq() {
    this.apiService.getFriendRequest(this.usersdetail.id).subscribe((res: any) => {
      if (res.message) {
        this.friendReqList = res.message;
        this.friendRequests = this.friendReqList;
      }
    });
  }
  getTeamReq() {
    this.apiService.getTeamRequest(this.usersdetail.id).subscribe((res: any) => {
      if (res) {
        this.teamReqList = res.message;
        this.teamRequests = this.teamReqList;
      }
    });
  }
  getGrpChatReq() {
    this.apiService.getGroupchatRequest(this.usersdetail.id).subscribe((res: any) => {
      if (res) {
        this.groupReqList = res.message;
        this.groupChatRequests = this.groupReqList;
      }
    });
  }
  getGuardianReqAsAthlete() {
    this.apiService.getGuardianReqAsAthlete(this.usersdetail.id).subscribe((res: any) => {
      if (res) {
        this.guardianReqList = res.message;
        this.guardianRequests = this.guardianReqList;
      }
    });
  }
  getGuardianReqAsGuardian() {
    this.apiService.getGuardianReqAsGuardian(this.usersdetail.id).subscribe((res: any) => {
      if (res) {
        this.guardianReqList = res.message;
        this.guardianRequests = this.guardianReqList;
      }
    });
  }

  async acceptFrndReq(itemId, n) {
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
          text: this.okString,
          handler: () => {
            this.data = {
              user_id: this.usersdetail.id,
              friend_id: itemId
            };
            this.socket.emit('accept-friend', this.data);
            this.friendRequests.splice(n, 1);
            this.utilServ.userAddonDetails();
            this.utilServ.friendsList = null;
            this.utilServ.userAddonDetails();
            this.checkReqExist();
            this.eventCustom.publish('badgeCount', '');

          }
        }
      ]
    });
    await alert.present();
  }
  async deleteFrndReq(itemId, n) {
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
          text: this.okString,
          handler: () => {
            this.data = {
              user_id: this.usersdetail.id,
              friend_id: itemId
            };

            this.socket.emit('reject-friend', this.data);
            this.friendRequests.splice(n, 1);
            this.utilServ.friendsList = null;
            this.utilServ.userAddonDetails();
            this.checkReqExist();
            this.eventCustom.publish('badgeCount', '');

          }
        }
      ]
    });
    await alert.present();
  }

  async acceptTeamReq(teamData, n) {
    const alert = await this.alertController.create({
      message: this.acceptTeamReqString,
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
            this.apiService.acceptTeamInviteRequest(this.usersdetail.id, teamData.teamid).subscribe((res: any) => {
              const grpCreatData = {
                message: {
                  group_id: teamData.teamid,
                  group_type: 1,
                  msg_type: 3,
                  content: '',
                  media: '',
                  userinfo: { from_id: this.usersdetail.id, name: this.usersdetail.first_name }
                }
              };
              this.data = {
                user_id: this.usersdetail.id,
                teamid: teamData.teamid,
                manager: teamData.masteradminid,
                team_name: teamData.team_name
              };
              this.socket.emit('accept-team-join', this.data);
              this.socket.emit('send-group-userchat-status', grpCreatData);
              this.teamRequests.splice(n, 1);
              this.checkReqExist();

            });
          }
        }
      ]
    });
    await alert.present();
  }
  async deleteTeamReq(teamData, n) {
    const alert = await this.alertController.create({
      message: this.deleteTeamReqString,
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
            this.apiService.rejectTeamInviteRequest(this.usersdetail.id, teamData.teamid).subscribe((res: any) => {
              this.data = {
                user_id: this.usersdetail.id,
                teamid: teamData.teamid,
                manager: teamData.masteradminid,
                team_name: ''
              };

              this.socket.emit('reject-team-request', this.data);
              this.teamRequests.splice(n, 1);
              this.checkReqExist();

            });
          }
        }
      ]
    });
    await alert.present();
  }

  async acceptGrpReq(itemId, itemGrpMaster, n, grpName) {
    const alert = await this.alertController.create({
      message: this.acceptGrpReqString,
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
            this.apiService.acceptGroupchatInviteRequest(this.usersdetail.id, itemId).subscribe((res: any) => {
              this.data = {
                user_id: this.usersdetail.id,
                groupid: itemId,
                manager: itemGrpMaster,
                group_name: grpName
              };
              this.socket.emit('accept-groupchat-join', this.data);
              const grpCreatData = {
                message: {
                  group_id: itemId,
                  group_type: 2,
                  msg_type: 3,
                  content: '',
                  media: '',
                  userinfo: { from_id: this.usersdetail.id, name: this.usersdetail.first_name }
                }
              };
              this.socket.emit('send-group-userchat-status', grpCreatData);
              this.groupChatRequests.splice(n, 1);
              this.checkReqExist();

            });
          }
        }
      ]
    });
    await alert.present();
  }
  async deleteGrpReq(itemId, itemGrpMaster, n) {
    const alert = await this.alertController.create({
      message: this.deleteGrpReqString,
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
            this.apiService.rejectGroupchatInviteRequest(this.usersdetail.id, itemId).subscribe((res: any) => {
              this.data = {
                user_id: this.usersdetail.id,
                teamid: itemId,
                manager: itemGrpMaster
              };
              this.socket.emit('reject-groupchat-request', this.data);
              this.groupChatRequests.splice(n, 1);
              this.checkReqExist();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  async acceptGuardReq(block, n) {
    const reqId = block.id;
    const daa = {
      guardName: '' + this.usersdetail.first_name + ' ' + this.usersdetail.last_name,
      minorName: '' + block.first_name + ' ' + block.last_name
    };
    localStorage.setItem('namesForAgreementGuard', JSON.stringify(daa));
    const modal = await this.modalController.create({
      component: GuardianTermsComponent
    });
    modal.onDidDismiss().then((code) => {
      localStorage.removeItem('namesForAgreementGuard');
      if (code.data === true) {
        this.apiService.acceptGuardianRequest(reqId, this.usersdetail.id).subscribe((res: any) => {
          if (res) {
            this.utilServ.getMyMinors(this.usersdetail.id);
            this.guardianRequests.splice(n, 1);
            this.getMyMinor();
          }
        });
        const data = { id: reqId };
        this.socket.emit('guardian-accept-request', data);
      }
    });
    return await modal.present();
  }
  deleteGuardReq(reqId, n) {
    this.apiService.rejectGuardianRequest(reqId, this.usersdetail.id).subscribe((res: any) => {
      if (res) {
        this.guardianRequests.splice(n, 1);
        const data = { id: reqId };
        this.socket.emit('guardian-reject-request', data);
      }
    });
  }
  cancelGuardreq(UserId, n) {
    this.apiService.cancelGuardianRequest(UserId, this.usersdetail.id).subscribe((res: any) => {
      if (res.success === 1) {
        this.guardianRequests.splice(n, 1);
      }
    });
  }


  // Search on direct chat
  searchFrndReq(x) {
    this.friendRequests = this.filterFrndReq(this.friendReqList, x || null);
  }
  searchTeamReq(x) {
    this.teamRequests = this.filterTeamReq(this.teamReqList, x || null);
  }
  searchGrpReq(x) {
    this.groupChatRequests = this.filterGrpReq(this.groupReqList, x || null);
  }
  searchGuardReq(x) {
    this.guardianRequests = this.filterGuardReq(this.guardianReqList, x || null);
  }
  filterFrndReq(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.sender_name.toLowerCase().includes(terms);
    });
  }
  filterTeamReq(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.team_name.toLowerCase().includes(terms);
    });
  }
  filterGrpReq(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.group_name.toLowerCase().includes(terms);
    });
  }
  filterGuardReq(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.group_name.toLowerCase().includes(terms);   // change
    });
  }

  getTimeFromNow(dates) {
    return moment(dates).fromNow(true);
  }

  checkReqExist() {
    const inter = setInterval(() => {
      if (this.usersdetail) {
        if (this.teamRequests.length > 0 || this.friendRequests.length > 0 || this.groupChatRequests.length > 0) {
          this.noRequest = false;
          clearInterval(inter);
        } else {
          this.noRequest = true;
          clearInterval(inter);
        }
      }
    }, 600);
  }
  friendDetail(id) {
    this.router.navigate([`profile/${id}`]);
  }
  onRequestPage() {
    if (JSON.parse(localStorage.getItem('currentLocation')) === "/requests") {
      this.apiService.seenRequests(this.usersdetail.id).subscribe((res: any) => {
        if (res.message) {
          this.eventCustom.publish('badgeCount', res);
        }
      });
    }
  }
  goToProfile(id) {
    this.router.navigate([`profile/${id}`]);
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.requestsString = this.utilServ.getLangByCode('requests');
      this.noRequestsString = this.utilServ.getLangByCode('no_requests');
      this.friendReqString = this.utilServ.getLangByCode('friend');
      this.groupChatReqString = this.utilServ.getLangByCode('group');
      this.teamReqString = this.utilServ.getLangByCode('team');
      this.acceptString = this.utilServ.getLangByCode('accept');
      this.deleteString = this.utilServ.getLangByCode('decline');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.searchString = this.utilServ.getLangByCode('search');
      this.okString = this.utilServ.getLangByCode('ok');
      this.acceptFrndReqString = this.utilServ.getLangByCode('are_you_accept_frnd_req');
      this.deleteFrndReqString = this.utilServ.getLangByCode('are_you_cancel_friend_req');
      this.acceptTeamReqString = this.utilServ.getLangByCode('accept_team_request');
      this.deleteTeamReqString = this.utilServ.getLangByCode('reject_team_request');
      this.acceptGrpReqString = this.utilServ.getLangByCode('join_group_req_accept');
      this.deleteGrpReqString = this.utilServ.getLangByCode('join_group_req_reject');
      this.noFriendReqString = this.utilServ.getLangByCode('no_friend_req');
      this.noTeamReqString = this.utilServ.getLangByCode('noTeamReqString');
      this.noGrpReqString = this.utilServ.getLangByCode('no_group_req');
      this.noGuardReqString = this.utilServ.getLangByCode('no_guardian_request ');
      this.pendingString = this.utilServ.getLangByCode('pending');
      this.blockAccessGetGuardianString = this.utilServ.getLangByCode('minor.noGuardian.message');
    }
  }
  getuserStatus() {
    this.apiService.getUserStatus(this.usersdetail.id).subscribe((res: any) => {
      this.userStatus = res.message;
      if (this.userStatus.isMinor === true) {
        this.isMinor = true;
        if (this.userStatus.isGuardedAthlete === true) {
          this.showGuardData = true;
        } else {
          this.showGuardData = false;
        }
        this.getGuardianReqAsAthlete();
      } else {
        this.isMinor = false;
        this.getGuardianReqAsGuardian();
      }
    });
  }
  getMyMinor() {
    this.apiService.getGuardedAthletes(this.usersdetail.id).subscribe((res: any) => {
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
