import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AboutTeamComponent } from 'src/app/components/about-team/about-team.component';
import { AddTeamEventComponent } from 'src/app/components/add-team-event/add-team-event.component';
import { Socket } from 'ngx-socket-io';
import { EditTeamEventComponent } from 'src/app/components/edit-team-event/edit-team-event.component';
import { ViewTeamEventComponent } from 'src/app/components/view-team-event/view-team-event.component';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.page.html',
  styleUrls: ['./about-team.page.scss'],
})
export class AboutTeamPage implements OnInit {
  environment: any;

  teamData: any = null;
  eventList: any = null;
  eventItems = false;
  userDetail;
  isAdmin = false;

  // String
  noEventsString = 'No events to show';
  createEventString = 'Create Event';
  dateString = 'Date';
  venueString = 'Venue';
  deleteString = 'Delete';
  eventConfirmDeleteString = 'Do You wnat to delete this event';
  cancelString = 'cancel';
  okString = 'ok';

  constructor(
    private location: Location,
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService,
    private socket: Socket,
    private modalController: ModalController,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.environment = environment;
    this.actRouter.queryParams.subscribe(() => {
      this.teamData = JSON.parse(localStorage.getItem('teamData'));
      this.getEvents();
      this.getLanguageStrings();
    });
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());

  }

  ngOnInit() {
  }

  getEvents() {
    if (this.teamData) {
      // tslint:disable-next-line: radix
      if (parseInt(this.teamData.masteradminid) === parseInt(this.userDetail.id)) {
        this.isAdmin = true;
      }
      this.utilServ.showLoaderWait();
      this.apiService.connectFuntion();
      this.apiService.listTeamEvent(this.userDetail.id, this.teamData.teamid).pipe().subscribe((res: any) => {
        this.eventList = res.message;
        if (this.eventList === '') {
          this.eventList = [];
          this.eventItems = false;
        }
        else {
          this.eventItems = true;
        }
        setTimeout(() => {
          this.utilServ.hideLoaderWait();
          this.utilServ.hideLoaderWaitAMin();
        }, 1000);
        this.utilServ.hideLoaderWait();
        this.utilServ.hideLoaderWaitAMin();
      });
    }
  }

  ionViewWillEnter() {
  }

  async aboutTeam() {
    const modal = await this.modalController.create({
      component: AboutTeamComponent,
      componentProps: {
        custom_data: this.teamData.teamid,
        type: 'team'
      }
    });
    modal.onDidDismiss().then((ref) => {
      if (ref.data.data === 0) {
        this.teamData = JSON.parse(localStorage.getItem('teamData'));
      }
    });
    return await modal.present();
  }

  async addEvent() {
    const modal = await this.modalController.create({
      component: AddTeamEventComponent
    });
    modal.onDidDismiss().then(() => {
      this.teamData = JSON.parse(localStorage.getItem('teamData'));
      this.getEvents();
    });

    return await modal.present();
  }

  async deleteEvent(eventId, eventTitle) {
    const confirm = await this.alertController.create({
      header: this.deleteString + '?',
      message: this.eventConfirmDeleteString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel'
        },
        {
          text: this.okString,
          handler: () => {
            this.apiService.deleteTeamEvent(this.userDetail.id, this.teamData.teamid, eventId).pipe().subscribe((res: any) => {
              this.teamData = JSON.parse(localStorage.getItem('teamData'));
              this.getEvents();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  async editEvent(eventData) {
    // console.log(eventData);
    const modal = await this.modalController.create({
      component: EditTeamEventComponent,
      componentProps: {
        custom_data: eventData
      }
    });
    modal.onDidDismiss().then(() => {
      this.getEvents();
    });
    await modal.present();
  }

  async viewDetail(data) {
    const modal = await this.modalController.create({
      component: ViewTeamEventComponent,
      componentProps: {
        custom_data: data,
      }
    });
    modal.onDidDismiss().then((ref) => {
      if (ref.data.data === 0) {
        this.teamData = JSON.parse(localStorage.getItem('teamData'));
        this.getEvents();
      }
    });
    return await modal.present();
  }

  back() {
    this.location.back();
  }

  ionViewWillLeave() {
    localStorage.removeItem('teamData');
    // this.teamData = [];
    // this.isAdmin = false;
    // this.teammembers = [];
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.noEventsString = this.utilServ.getLangByCode('no_events_show');
      this.createEventString = this.utilServ.getLangByCode('create_event');
      this.dateString = this.utilServ.getLangByCode('date');
      this.venueString = this.utilServ.getLangByCode('venue');
      this.deleteString = this.utilServ.getLangByCode('delete');
      this.eventConfirmDeleteString = this.utilServ.getLangByCode('confirm_delete');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.okString = this.utilServ.getLangByCode('ok');
    }
  }
}
