import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ModalController } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ViewTeamEventComponent } from 'src/app/components/view-team-event/view-team-event.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  noevent = true;
  userDetail: any;
  teameventList: any[] = [];
  radioValue = 'all';
  noStarEvent = true;
  // Strings
  eventsString = 'Events';
  noEventsString = 'No Events to show';
  dateString = 'Date';
  venueString = 'Venue';
  allString = 'All';

  constructor(
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private modalController: ModalController,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.noevent = true;
      this.radioValue = 'all';
      this.utilServ.checkUserExists();
      this.getEvents();
    });
  }

  ngOnInit() { }

  setUpBasic() {
    if (this.utilServ.langSetupFLag) {
      this.noEventsString = this.utilServ.getLangByCode('no_events_show');
      this.eventsString = this.utilServ.getLangByCode('events');
      this.dateString = this.utilServ.getLangByCode('date');
      this.venueString = this.utilServ.getLangByCode('venue');
      this.allString = this.utilServ.getLangByCode('all');
    } else {
      this.utilServ.checkBasicElseRelodApp();
      window.location.reload();
    }
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
  }
  getEvents() {
    this.setUpBasic();
    this.apiService.getAllMyTeamEvents(this.userDetail.id).pipe().subscribe((res: any) => {
      this.teameventList = res.message;
      this.teameventList = this.teameventList.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
      if (this.teameventList.length === 0) {
        this.noevent = true;
      } else {
        this.noevent = false;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.teameventList.length; i++) {
          const t = this.teameventList[i];
          t.isStared = false;
        }

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.teameventList.length; i++) {
          const x = this.teameventList[i];
          this.apiService.starStatusEvent(x.teamid, x.id, this.userDetail.id).pipe().subscribe((starRes: any) => {
            if (starRes.message[0]) {
              this.noStarEvent = false;
              const y = starRes.message[0].stared;
              x.isStared = y === 1 ? true : false;
            }
          });
        }
      }
    });
  }


  async viewDetail(data) {
    const d = {
      teamid: data.teamid,
      team_name: data.teamname,
    };
    const modal = await this.modalController.create({
      component: ViewTeamEventComponent,
      componentProps: {
        custom_data: data,
        team_data: d,
      }
    });
    modal.onDidDismiss().then(() => {
      this.getEvents();
    });
    return await modal.present();
  }
  sortSelect() {
    if (this.radioValue === 'stared') {
      // this.noevent = true;
    } else {
      // this.noevent = false;
    }
    if (this.radioValue === 'all') {
      // this.noevent = false;
    } else {
      // this.noevent = true;
    }
  }
}
