import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { AddGroupChatMembersComponent } from 'src/app/components/add-group-chat-members/add-group-chat-members.component';
import { Socket } from 'ngx-socket-io';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-about-group-chat',
  templateUrl: './about-group-chat.component.html',
  styleUrls: ['./about-group-chat.component.scss'],
})
export class AboutGroupChatComponent implements OnInit {

  grpmembers: any;
  grpData: any;
  userDetail: any;
  membersCount = 0;
  environment;
  grpName;
  grpDesc;
  isAdmin = false;
  canEditName = false;
  canEditDesc = false;
  hideAddMemberButton;
  grpImage;
  friendsList: any;
  imageToUpload = [];

  // Strings
  membersString = 'Members';
  addMembersString = 'Add Members';
  descriptionString = 'Description';
  titleString = 'Title';
  adminString = 'Admin';
  requestedString = 'Requested';
  allMemberAreAlredyInString = 'All friends already part of this team.';
  messageString = 'Message';
  cancelString = 'Cancel';
  makeAdminString = 'Make Admin';
  removeFromGrpString = 'Remove form team';
  dismissAdminString = 'Dissmiss Admin';
  userRemovedString = 'User removed!';
  picToSend: string;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private socket: Socket,
    private actRouter: ActivatedRoute,
    private eventCustom: EventsCustomService,
    private actionSheetController: ActionSheetController,
    private nativeLib: DeviceNativeApiService,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.setUpBasic();
    });
  }

  ngOnInit() {
    this.environment = environment;
  }

  setUpBasic() {
    this.grpData = JSON.parse(localStorage.getItem('teamData'));
    // console.log('GrpData', this.grpData);
    this.grpName = this.grpData.team_name;
    this.grpDesc = this.grpData.team_info;
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    if (this.grpData.team_pic === '') {
      this.grpImage = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=profile/cover1.jpg`;
    } else {
      this.grpImage = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=groupchat/${this.grpData.id}/${this.grpData.team_pic}`;
    }
    this.getGroupchatMembers();
    if (this.utilServ.langSetupFLag) {
      this.membersString = this.utilServ.getLangByCode('members');
      this.addMembersString = this.utilServ.getLangByCode('add_members');
      this.descriptionString = this.utilServ.getLangByCode('description');
      this.titleString = this.utilServ.getLangByCode('title');
      this.adminString = this.utilServ.getLangByCode('admin');
      this.requestedString = this.utilServ.getLangByCode('requested');
      this.allMemberAreAlredyInString = this.utilServ.getLangByCode('allMemberAreAlredyInString');
      this.messageString = this.utilServ.getLangByCode('message');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.makeAdminString = this.utilServ.getLangByCode('make_admin');
      this.removeFromGrpString = this.utilServ.getLangByCode('remove_from_team');
      this.dismissAdminString = this.utilServ.getLangByCode('dismis_admin');
      this.userRemovedString = this.utilServ.getLangByCode('userRemovedString');
    }


  }

  editName(moveHere) {
    this.canEditName = !this.canEditName;
    this.setFocus(moveHere);
  }

  editNameSave(teamnameEdited, teamdescEdited) {
    this.canEditName = !this.canEditName;
    this.apiService.updateGroupChatData(this.grpData.teamid, teamnameEdited, teamdescEdited).subscribe((res: any) => {
      if (res.success === 1) {
        localStorage.removeItem('teamData');
        this.grpData.team_name = teamnameEdited;
        localStorage.setItem('teamData', JSON.stringify(this.grpData));
      }
    });
  }

  editDesc(moveHere) {
    this.canEditDesc = !this.canEditDesc;
    this.setFocus(moveHere);
  }

  editDescSave(teamnameEdited, teamdescEdited) {
    this.canEditDesc = !this.canEditDesc;
    this.apiService.updateGroupChatData(this.grpData.teamid, teamnameEdited, teamdescEdited).subscribe((res: any) => {
      if (res.success === 1) {
        localStorage.removeItem('teamData');
        this.grpData.team_info = teamdescEdited;
        localStorage.setItem('teamData', JSON.stringify(this.grpData));
      }
    });
  }

  async addNewMember() {
    const modal = await this.modalController.create({
      component: AddGroupChatMembersComponent,
      componentProps: {
        custom_data: null
      }
    });
    modal.onDidDismiss().then((data) => {
      this.getGroupchatMembers();
      this.closeModal(0);
    });
    return await modal.present();
  }

  async optionsPanel(data) {
    if (this.isAdmin === true && data.userid !== this.userDetail.id) {
      if (data.role === 0 && data.member_accepted === '1') {
        // They Are part of team [request accepted] & not Admin
        const asNoAdminAcceptedMember = await this.actionSheetController.create({
          buttons: [{
            text: this.messageString,
            role: 'destructive',
            icon: 'mail',
            handler: () => {
              this.closeModal(0);
              this.utilServ.navChatwithId(data.userid);
            }
          },
          {
            text: this.makeAdminString,
            role: 'destructive',
            icon: 'shield-checkmark',
            handler: () => {
              this.apiService.makeTeamAdmin(data.userid, data.teamid, 0).pipe().subscribe((res: any) => {
                // console.log(res);
                this.setUpBasic();
              });
            }
          },
          {
            text: this.removeFromGrpString,
            icon: 'remove',
            handler: () => {
              const dataTosend = {
                user_id: data.userid,
                groupid: data.teamid
              };
              this.socket.emit('remove-groupchat-user', dataTosend);
              const data1 = {
                message: {
                  group_id: this.grpData.id,
                  group_type: 2,
                  msg_type: 5,
                  content: '',
                  media: '',
                  userinfo: { from_id: data.userid, name: data.first_name }
                }
              };
              this.setUpBasic();
              this.apiService.socketEmit('send-group-userchat-status', data1);
              this.utilServ.okButtonMessageAlert(this.userRemovedString);
            }



            //   this.apiService.removeTeamMember(data.userid, data.teamid, 2, this.membersCount).pipe().subscribe((res: any) => {
            //     console.log(res);
            //     const data1 = {
            //       message: {
            //         group_id: this.grpData.id,
            //         group_type: 2,
            //         msg_type: 5,
            //         content: '',
            //         media: '',
            //         userinfo: { from_id: data.userid, name: data.first_name }
            //       }
            //     };
            //     this.setUpBasic();
            //     this.apiService.socketEmit('send-group-userchat-status', data1);
            //   });
            // }
          },
          {
            text: this.cancelString,
            icon: 'close',
            role: 'cancel',
            handler: () => {
              // console.log('Cancel clicked');
            }
          }]
        });
        await asNoAdminAcceptedMember.present();
      } else if (data.role === 0 && data.member_accepted === '0') {
        // They Are on  requested status and not Admin
        const asNoAdminNotAccepted = await this.actionSheetController.create({
          buttons: [{
            text: this.messageString,
            role: 'destructive',
            icon: 'mail',
            handler: () => {
              this.closeModal(0);
              this.utilServ.navChatwithId(data.userid);
            }
          },
          {
            text: this.removeFromGrpString,
            icon: 'remove',
            handler: () => {

              this.apiService.removeGroupchatInviteRequest(data.teamid, data.userid).pipe().subscribe((res) => {
                const dataTosend = {
                  user_id: data.userid,
                  groupid: data.teamid
                };
                this.socket.emit('remove-groupchat-user-invite', dataTosend);
                this.utilServ.okButtonMessageAlert(this.userRemovedString);
                this.setUpBasic();
              });
            }
          },
          {
            text: this.cancelString,
            icon: 'close',
            role: 'cancel',
            handler: () => {
              // console.log('Cancel clicked');
            }
          }]
        });
        await asNoAdminNotAccepted.present();
      } else if (data.role === 1 && data.member_accepted === '1') {
        // They Are part of team [request accepted]  and  Admin
        const asAdminAccepted = await this.actionSheetController.create({
          buttons: [{
            text: this.messageString,
            role: 'destructive',
            icon: 'mail',
            handler: () => {
              this.closeModal(0);
              this.utilServ.navChatwithId(data.userid);
            }
          }, {
            text: this.dismissAdminString,
            role: 'destructive',
            icon: 'shield',
            handler: () => {
              const dataTosend = {
                user_id: data.userid,
                groupid: data.teamid
              };
              this.socket.emit('remove-groupchat-user', dataTosend);
              const data1 = {
                message: {
                  group_id: data.teamid,
                  group_type: 2,
                  msg_type: 5,
                  content: '',
                  media: '',
                  userinfo: { from_id: data.userid, name: data.first_name }
                }
              };
              this.apiService.socketEmit('send-group-userchat-status', data1);
              this.utilServ.okButtonMessageAlert(this.userRemovedString);
              this.setUpBasic();
            }
          },
          {
            text: this.cancelString,
            icon: 'close',
            role: 'cancel',
            handler: () => {
              // console.log('Cancel clicked');
            }
          }]
        });
        await asAdminAccepted.present();
      }
    } else if (this.isAdmin === false) {
      // Not a admin just visiting someones group
      const asNotMyGroup = await this.actionSheetController.create({
        buttons: [{
          text: this.messageString,
          role: 'destructive',
          icon: 'mail',
          handler: () => {
            this.closeModal(0);
            this.utilServ.navChatwithId(data.userid);
          }
        },
        {
          text: this.cancelString,
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }]
      });
      await asNotMyGroup.present();
    }
  }


  closeModal(code) {
    localStorage.removeItem('teamMembers');
    this.modalController.dismiss({
      dismissed: true,
      data: code
    });
  }
  presentActionSheet() {
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      this.apiService.updateGroupcover(imgData.blob, this.grpData.teamid).subscribe((data: any) => {
        if (data.success === 1) {
          this.grpImage = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=groupchat/${this.grpData.id}/${data.message.original}`;
          localStorage.removeItem('teamData');
          this.grpData.team_pic = data.message.original;
          this.grpData.team_pic_small = data.message.thumbnail;
          localStorage.setItem('teamData', JSON.stringify(this.grpData));
          this.eventCustom.destroy('imageReady');
        } else {
        }
      },
        (error: any) => {
        });
    });
  }
  setFocus(nextElement) {
    nextElement.setFocus();
  }
  getGroupchatMembers() {
    this.apiService.getGroupchatMembers(this.grpData.teamid).pipe().subscribe((res: any) => {
      this.grpmembers = res.message;
      this.membersCount = this.grpmembers.length;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.membersCount; i++) {
        let temp = 0;
        if (this.grpmembers[i].userid === this.userDetail.id) {
          temp = this.grpmembers[i].role;
        }
        if (temp === 1) {
          this.isAdmin = true;
        }
        this.grpmembers[i].fullName = (this.grpmembers[i].first_name + ' ' + this.grpmembers[i].last_name);
      }

      if (this.isAdmin === false) {
        let x: any = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.grpmembers.length; i++) {

          // tslint:disable-next-line: radix
          if (parseInt(this.grpmembers[i].member_accepted) === 1) {
            x.push(this.grpmembers[i]);
          }
        }
        this.grpmembers = x;
        this.membersCount = this.grpmembers.length;
        x = null;
      }
      localStorage.setItem('teamMembers', JSON.stringify(this.grpmembers));
      this.hideAddMemberButton = this.canAddOrNot();
    });
  }

  canAddOrNot() {
    this.friendsList = this.utilServ.friendsList;
    const y: any = [];
    for (const item of this.grpmembers) {
      y.push(item.userid);
    }
    const temp = this.friendsList.filter(res => y.indexOf(res.id) === -1);
    if (temp.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  handlefileinputProfile(x) { }

}
