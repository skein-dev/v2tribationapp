import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  environment: any;

  userDetail;
  allTeamList: any[] = [];
  myTeamList: any[] = [];
  noTeams = false;
  noOwnTeam = false;
  animationLoder = true;
  checkedsegment = 'allTeam';

  // String
  teamString = 'Team';
  allTeamString = 'All Teams';
  manageString = 'Manage';
  searchString = 'Search';
  okString = 'Ok';
  deleteTeamsString = 'Are you sure you want to delete this Team?';
  messageDeletedString = 'Team Deleted!';
  noTeamString = 'No Teams';
  cancelString = 'Cancel';
  deleteString = 'Delete';
  leaveString = 'Leave';
  searchTeam = '';
  searchMyTeam = '';
  leaveTeamsString = 'Are you sure you want to leave this team';
  leftString = 'You left the team!';


  constructor(
    private router: Router,
    public socket: Socket,
    private alertController: AlertController,
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.utilServ.checkUserExists();
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.getLanguageStrings();
    });

    this.socket.on('invite-team-member', (data) => {
      this.allTeamListFun();
    });
  }

  ngOnInit() {
    this.environment = environment;

  }

  ionViewWillEnter() {
    this.allTeamListFun();
    localStorage.removeItem('teamData');
  }
  segmentChanged(ev) {
    this.checkedsegment = ev.detail.value;
    if (this.checkedsegment === 'manage') {
      this.allTeamListFun();
    } else if (this.checkedsegment === 'allTeam') {
      this.myTeam();
    }
  }
  allTeamListFun() {
    this.apiService.getTeamList(this.userDetail.id).pipe().subscribe((allTeam: any) => {
      this.apiService.connectFuntion();
      this.allTeamList = allTeam.message;
      if (this.allTeamList === null || this.allTeamList.length === 0) {
        this.noTeams = true;
        this.animationLoder = false;
      } else {
        this.noTeams = false;
        this.animationLoder = false;
      }
    }, error => {
      this.utilServ.networkError();
    });
    setTimeout(() => {
      this.myTeam();
    }, 500);
  }

  myTeam() {
    this.apiService.getMyTeamList(this.userDetail.id).subscribe((myTeam: any) => {
      this.apiService.connectFuntion();
      this.myTeamList = myTeam.message;
      if (myTeam.message === 0) {
        this.noOwnTeam = true;
        this.animationLoder = false;
      } else {
        this.animationLoder = false;
        this.noOwnTeam = false;
      }
    }, error => {
      this.utilServ.networkError();
    });
  }
  aboutTeam(teamToShow) {
    localStorage.setItem('teamData', JSON.stringify(teamToShow));
    this.router.navigate(['/teams/about-team']);
  }
  async deleteTeams(teamId, adminId) {
    if (adminId === this.userDetail.id) {
      const confirmDel = await this.alertController.create({
        header: this.deleteString + '?',
        cssClass: 'buttonCss',
        message: this.deleteTeamsString,
        buttons: [{
          text: this.cancelString,
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: this.okString,
          handler: () => {
            this.apiService.deleteTeam(teamId, this.userDetail.id).subscribe((res: any) => {
              // console.log('deleteChats', res);
              if (res.success === 1) {
                this.allTeamListFun();
                this.utilServ.presentToast(this.messageDeletedString);
              }
            }, error => {
              this.utilServ.networkError();
            });
          }
        }
        ]
      });
      confirmDel.present();
    } else {
      const confirmLeave = await this.alertController.create({
        header: this.leaveString + '?',
        cssClass: 'buttonCss',
        message: this.leaveTeamsString,
        buttons: [{
          text: this.cancelString,
          role: 'cancel',
        },
        {
          text: this.okString,
          handler: () => {
            this.apiService.leaveTeam(teamId, this.userDetail.id).subscribe((res: any) => {
              // console.log('leaveTeam', res);
              if (res.success === 1) {
                this.allTeamListFun();
                this.utilServ.presentToast(this.leftString);
              }
            }, error => {
              this.utilServ.networkError();
            });
          }
        }
        ]
      });
      confirmLeave.present();
    }
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.deleteString = this.utilServ.getLangByCode('delete');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.noTeamString = this.utilServ.getLangByCode('no_team');
      this.messageDeletedString = this.utilServ.getLangByCode('team') + ' ' + this.utilServ.getLangByCode('deleted') + '!';
      this.deleteTeamsString = this.utilServ.getLangByCode('team.label.deleteTeamConfirmation');
      this.leaveTeamsString = this.utilServ.getLangByCode('leave_team_confirm');
      this.okString = this.utilServ.getLangByCode('ok');
      this.searchString = this.utilServ.getLangByCode('search');
      this.manageString = this.utilServ.getLangByCode('manage');
      this.allTeamString = this.utilServ.getLangByCode('all_team');
      this.teamString = this.utilServ.getLangByCode('team');
      this.leftString = this.utilServ.getLangByCode('team.label.leftTeam');
      this.leaveString = this.utilServ.getLangByCode('leave');
    }
  }
}
