import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { AddTeamMemberComponent } from '../add-team-member/add-team-member.component';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss'],
})
export class AboutTeamComponent implements OnInit {
  teammembers: any;
  teamData: any;
  userDetail: any;
  membersCount = 0;
  environment;
  teamName;
  teamDesc;
  isAdmin = false;
  canEditName = false;
  canEditDesc = false;
  hideAddMemberButton;
  teamImage;
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
  removeFromTeamString = 'Remove form team';
  dismissAdminString = 'Dissmiss Admin';

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
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
    this.teamData = JSON.parse(localStorage.getItem('teamData'));
    this.teamName = this.teamData.team_name;
    this.teamDesc = this.teamData.team_info;
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    if (this.teamData.team_pic === '') {
      this.teamImage = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=profile/cover1.jpg`;

    } else {
      this.teamImage = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=team/${this.teamData.id}/${this.teamData.team_pic}`;

    }
    this.getTeamMembers();
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
      this.removeFromTeamString = this.utilServ.getLangByCode('remove_from_team');
      this.dismissAdminString = this.utilServ.getLangByCode('dismis_admin');
      this.removeFromTeamString = this.utilServ.getLangByCode('remove_from_team');
    }
  }

  getTeamMembers() {
    this.apiService.getTeamMembers(this.teamData.teamid).pipe().subscribe((res: any) => {
      this.teammembers = res.message;
      this.membersCount = this.teammembers.length;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.membersCount; i++) {
        let temp = 0;
        if (this.teammembers[i].userid === this.userDetail.id) {
          temp = this.teammembers[i].role;
        }
        if (temp === 1) {
          this.isAdmin = true;
        }
        this.teammembers[i].fullName = (this.teammembers[i].first_name + ' ' + this.teammembers[i].last_name);
      }

      if (this.isAdmin === false) {
        let x: any = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.teammembers.length; i++) {

          // tslint:disable-next-line: radix
          if (parseInt(this.teammembers[i].member_accepted) === 1) {
            x.push(this.teammembers[i]);
          }
        }
        this.teammembers = x;
        this.membersCount = this.teammembers.length;
        x = null;
      }
      localStorage.setItem('teamMembers', JSON.stringify(this.teammembers));
      this.hideAddMemberButton = this.canAddOrNot();
    });
  }

  editName(moveHere) {
    this.canEditName = !this.canEditName;
    this.setFocus(moveHere);
  }
  editNameSave(teamnameEdited, teamdescEdited) {
    this.canEditName = !this.canEditName;
    this.apiService.updateTeamData(this.teamData.teamid, teamnameEdited, teamdescEdited).subscribe((res: any) => {
      if (res.success === 1) {
        localStorage.removeItem('teamData');
        this.teamData.team_name = teamnameEdited;
        localStorage.setItem('teamData', JSON.stringify(this.teamData));
      }
    });
  }

  editDesc(moveHere) {
    this.canEditDesc = !this.canEditDesc;
    this.setFocus(moveHere);
  }
  editDescSave(teamnameEdited, teamdescEdited) {
    this.canEditDesc = !this.canEditDesc;
    this.apiService.updateTeamData(this.teamData.teamid, teamnameEdited, teamdescEdited).subscribe((res: any) => {
      if (res.success === 1) {
        localStorage.removeItem('teamData');
        this.teamData.team_info = teamdescEdited;
        localStorage.setItem('teamData', JSON.stringify(this.teamData));
      }
    });
  }

  async addNewMember() {
    const modal = await this.modalController.create({
      component: AddTeamMemberComponent,
      componentProps: {
        custom_data: null
      }
    });
    modal.onDidDismiss().then((data) => {
      this.closeModal(0);
      this.getTeamMembers();
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
            text: this.removeFromTeamString,
            icon: 'remove',
            handler: () => {
              this.apiService.removeTeamMember(data.userid, data.teamid, 2, this.membersCount).pipe().subscribe((res: any) => {
                // console.log(res);
                const data1 = {
                  message: {
                    group_id: this.teamData.id,
                    group_type: 1,
                    msg_type: 5,
                    content: '',
                    media: '',
                    userinfo: { from_id: data.userid, name: data.first_name }
                  }
                };
                this.setUpBasic();
                this.apiService.socketEmit('send-group-userchat-status', data1);
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
            text: this.removeFromTeamString,
            icon: 'remove',
            handler: () => {
              this.apiService.removeTeamMember(data.userid, data.teamid, 2, this.membersCount).pipe().subscribe((res: any) => {
                // console.log(res);
                const data1 = {
                  message: {
                    group_id: this.teamData.id,
                    group_type: 1,
                    msg_type: 5,
                    content: '',
                    media: '',
                    userinfo: { from_id: data.userid, name: data.first_name }
                  }
                };
                this.setUpBasic();
                this.apiService.socketEmit('send-group-userchat-status', data1);
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
              this.apiService.dismissTeamAdmin(data.userid, data.teamid, 1).pipe().subscribe((res: any) => {
                // console.log(res.message);
                // this.events.publish("disadmin");
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

  presentActionSheet() {
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      this.apiService.updateTeamcover(imgData.blob, this.teamData.teamid).pipe().subscribe((data: any) => {
        if (data.success === 1) {
          this.teamImage = imgData.webPath;
          localStorage.removeItem('teamData');
          this.teamData.team_pic = data.message.original;
          this.teamData.team_pic_small = data.message.thumbnail;
          localStorage.setItem('teamData', JSON.stringify(this.teamData));
          this.eventCustom.destroy('imageReady');
        } else {
          // console.log('can not get image data'); 
        }
      },
        (error: any) => {
          // console.log('Error' + '' + 'server Issue');
        });
    });
  }

  closeModal(code) {
    localStorage.removeItem('teamMembers');
    this.modalController.dismiss({
      dismissed: true,
      data: code
    });
  }

  setFocus(nextElement) {
    nextElement.setFocus();
  }

  canAddOrNot() {
    this.friendsList = this.utilServ.friendsList;
    const y: any = [];
    for (const item of this.teammembers) {
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
