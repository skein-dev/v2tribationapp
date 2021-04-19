import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';
import { ConditionalExpr } from '@angular/compiler';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss'],
})
export class AddTeamMemberComponent implements OnInit {
  teamData: any;
  selectedMembers = [];
  userDetails: any;
  environment;
  bucketURL: string;
  friendsList: any;
  teamMembers: any[] = [];
  membersCount: any;
  friendsChecked: any;
  anyMemberSelected = false;
  membersCountInit = 0;
  newTeam = true;
  isReady = false;
  // Strings
  selectTeamMemberString = 'Select Team Member';
  teamCreatedString = 'Team Created!';
  alreadyExistString = 'Group Already Exists';
  noFriendToAddString = 'You have no friends in your list to invite';

  constructor(
    private modalController: ModalController,
    private socket: Socket,
    private actRouter: ActivatedRoute,
    private apiService: ApiService,
    private utilServ: GenralUtilsService) {

    this.actRouter.queryParams.subscribe(() => {
      this.setupBasic();
      this.getLanguageStrings();
    });
  }
  ionViewWillEnter() {
  }
  ngOnInit() {
    this.environment = environment;

    // if (this.utilServ.langSetupFLag) {
    //   this.selectTeamMemberString = this.utilServ.getLangByCode('select_team_member');
    //   this.teamCreatedString = this.utilServ.getLangByCode('Team Created');
    //   this.alreadyExistString = this.utilServ.getLangByCode('grp_name_exist');
    // }
  }
  setupBasic() {
    let count = 0;
    this.teamData = JSON.parse(localStorage.getItem('teamData'));
    this.userDetails = JSON.parse(this.utilServ.getUserDetails());
    this.teamMembers = JSON.parse(localStorage.getItem('teamMembers'));
    this.friendsList = this.utilServ.friendsList;
    if (!this.teamMembers) {
      this.newTeam = true;
      this.teamMembers = this.friendsList;
    } else {
      this.newTeam = false;
    }
    this.membersCountInit = this.teamMembers.length;
    this.bucketURL = 'https://storage.googleapis.com/tribation_uploads_dev/';
    // tslint:disable-next-line: prefer-const
    let y: any = [];
    for (const item of this.teamMembers) {
      y.push(item.userid);
    }
    this.teamMembers = this.friendsList.filter(temp => y.indexOf(temp.id) === -1);
    if (0 >= this.teamMembers.length) {
      this.back();
    }
    this.teamMembers.forEach(ele => {
      ele.isChecked = false;
      count += 1;
      if (this.teamMembers.length === count) {
        this.isReady = true;
      }
    });
    this.teamMembers.sort((a, b) => {
      const bandA = a.name.toLowerCase();
      const bandB = b.name.toLowerCase();
      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    });
  }

  markSelected(thisTeamMember) {
    thisTeamMember.isChecked = !thisTeamMember.isChecked;
    this.change();
  }
  doneSelecting() {
    let x: any;
    const temp = [];
    if (this.newTeam === false) {
      x = this.teamMembers.filter(d => d.isChecked === true);
      x.forEach(ele => {
        temp.push(ele.id);
      });
      this.addMoreTeamMembers(temp);
    } else {

      x = this.friendsList.filter(d => d.isChecked === true);
      x.forEach(ele => {
        temp.push(ele.id);
      });
      temp.push(this.userDetails.id);
      this.createNewTeam(temp);
    }
  }
  change() {
    let x = false;
    this.teamMembers.forEach(ele => {
      if (ele.isChecked) {
        x = (x || ele.isChecked);
      }
    });
    this.anyMemberSelected = x;
  }
  addMoreTeamMembers(temp) {
    this.apiService.addTeamMembers(this.userDetails.id, this.teamData.teamid, temp, 2, this.membersCountInit)
      .subscribe((res: any) => {
        if (res.success === 1) {
          this.socket.emit('invite-team-member',
            { user_id: this.userDetails.id, teamid: this.teamData.teamid, teamname: this.teamData.teamName, members: temp });
          // this.utilServ.presentToast(this.teamCreatedString);
          this.back();
        }
      });
  }
  createNewTeam(temp) {
    // console.log(this.userDetails.id, this.teamData.teamName, this.teamData.teamDesc, this.teamData.teamPicUrl);

    this.apiService.createNewTeam(this.userDetails.id, this.teamData.teamName,
      this.teamData.teamDesc, this.teamData.teamPicUrl.original, this.teamData.teamPicUrl.thumbnail)
      .subscribe((res: any) => {
        if (res.message !== 'already exist') {
          this.addNewTeamMembers(res, temp);
        } else {
          this.utilServ.presentToast(this.alreadyExistString);
        }
      });
  }
  addNewTeamMembers(res, temp) {
    // console.log(temp);
    this.apiService.addNewTeamMembers(this.userDetails.id, res.message.insertId, temp, this.teamData.teamName)
      .subscribe((resCreat: any) => {
        if (resCreat.success === 1) {
          this.socket.emit('invite-team-member',
            { user_id: this.userDetails.id, teamid: res.message.insertId, teamname: this.teamData.teamName, members: temp });
          this.socket.emit('team-create',
            { username: this.userDetails.first_name, teamname: this.teamData.teamName, teammember: temp, userid: this.userDetails.id });
          this.utilServ.presentToast(this.teamCreatedString);
          localStorage.removeItem('teamData');
          this.back();
        }
      });
  }

  back() {
    this.modalController.dismiss();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.noFriendToAddString = this.utilServ.getLangByCode('you_have_no_friends');
      this.selectTeamMemberString = this.utilServ.getLangByCode('select_team_member');
      this.teamCreatedString = this.utilServ.getLangByCode('team_create_notification_setting');
      this.alreadyExistString = this.utilServ.getLangByCode('teamexist');
    }
  }
}
