import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { CreateGroupChatComponent } from 'src/app/components/create-group-chat/create-group-chat.component';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { ApiService } from '../../services/api.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-add-group-chat-members',
  templateUrl: './add-group-chat-members.component.html',
  styleUrls: ['./add-group-chat-members.component.scss'],
})
export class AddGroupChatMembersComponent implements OnInit {
  environment;
  friendsList: any[] = [];
  anyMemberSelected: boolean;
  grpMembers: any[] = [];
  membersCountInit: any;
  newGrp: boolean;
  userDetails: any;
  teamData: any;
  isReady = false;
  selectGrouupMemberString = 'Select Group Members';
  noFriendToAddString = 'You have no friends in your list to invite';

  constructor(
    private modalController: ModalController,
    private actRouter: ActivatedRoute,
    private socket: Socket,
    private apiService: ApiService,
    private eventCustom: EventsCustomService,
    private utilServ: GenralUtilsService) {
    this.eventCustom.subscribe('sucessGroupChatCreation', (data) => {
      if (data) {
        // console.log(data);
        this.eventCustom.destroy('sucessGroupChatCreation');
        setTimeout(() => {
          this.modalController.dismiss();
        }, 1000);
      }
    });
    this.actRouter.queryParams.subscribe(() => {
      let count = 0;
      this.environment = environment;
      this.grpMembers = JSON.parse(localStorage.getItem('teamMembers'));
      this.teamData = JSON.parse(localStorage.getItem('teamData'));
      this.userDetails = JSON.parse(this.utilServ.getUserDetails());
      this.friendsList = this.utilServ.friendsList;
      if (!this.grpMembers) {
        this.newGrp = true;
        this.grpMembers = this.friendsList;
      } else {
        this.newGrp = false;
      }
      this.membersCountInit = this.grpMembers.length;
      const y: any = [];
      for (const item of this.grpMembers) {
        y.push(item.userid);
      }
      this.grpMembers = this.friendsList.filter(temp => y.indexOf(temp.id) === -1);
      // console.log(this.grpMembers);
      if (0 >= this.grpMembers.length) {
        this.back();
      }
      this.friendsList.forEach(ele => {
        ele.isChecked = false;
        count += 1;

        if (count === this.friendsList.length) {
          this.isReady = true;
        }

      });
      this.getLanguageStrings();
    });
  }

  ngOnInit() {

  }
  markSelected(thisTeamMember) {
    thisTeamMember.isChecked = !thisTeamMember.isChecked;
    this.change();
  }

  async doneSelecting() {
    let x: any;
    const temp = [];

    if (this.newGrp === false) {
      x = this.grpMembers.filter(d => d.isChecked === true);
      x.forEach(ele => {
        temp.push(ele.id);
      });
      this.addMoreGrpMembers(temp);
    } else {
      x = this.friendsList.filter(d => d.isChecked === true);
      x.forEach(ele => {
        temp.push(ele.id);
      });
      const dataGroupMembers = {
        ids: temp,
        details: x
      };
      this.presentModel(dataGroupMembers);
    }
  }
  async presentModel(dataGroupMembers) {
    const modal = await this.modalController.create({
      component: CreateGroupChatComponent,
      componentProps: {
        data: dataGroupMembers
      }
    });
    modal.onDidDismiss().then((ref) => {
      if (ref.data.data === 0) {
      }
    });
    return await modal.present();
  }
  addMoreGrpMembers(temp) {
    // console.log(this.userDetails.id, this.teamData.teamid, this.teamData, temp, this.teamData.type);
    this.apiService.addGroupMembers(this.userDetails.id, this.teamData.teamid, this.teamData, temp, this.teamData.type).
      pipe().subscribe((res) => {
        const data = {
          members: temp,
          user_id: this.userDetails.id,
          teamid: this.teamData.teamid,
          groupname: this.teamData.groupName
        };
        this.socket.emit('invite-groupchat-member', data);
        this.back();
      });
  }
  change() {
    let x = false;
    this.friendsList.forEach(ele => {
      if (ele.isChecked) {
        x = (x || ele.isChecked);
      }
    });
    this.anyMemberSelected = x;
  }
  back() {
    this.modalController.dismiss({
      dismissed: true,
      data: null
    });
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.noFriendToAddString = this.utilServ.getLangByCode('you_have_no_friends');
      this.selectGrouupMemberString = this.utilServ.getLangByCode('selectGrouupMemberString');
    }
  }
}
