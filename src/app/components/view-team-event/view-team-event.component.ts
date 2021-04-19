import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { Calendar } from '@ionic-native/calendar/ngx';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-team-event',
  templateUrl: './view-team-event.component.html',
  styleUrls: ['./view-team-event.component.scss'],
})
export class ViewTeamEventComponent implements OnInit {
  @ViewChild('alarm') alarm;
  @ViewChild('alarmUpdated') alarmUpdated;

  userDetail;
  eventList: any;
  alarmTimeUpdated;
  alarmTime;
  teamDetailList: any;
  star: any = 0;
  oldDataSync;
  resultSync;
  isSyncedSync = 0;
  isStaredSync = 0;
  demo;
  // Strings
  eventTitleString = 'Event Title';
  VieweventTitleString = 'View Event';
  eventDescString = 'Event Description';
  eventDateString = 'Event Date';
  eventVenueString = 'Event Venue';
  eventAlredyString = 'Event Already Exists in your calnder';
  eventDoesNotString = 'Event Doesnt Exists in your calnder';
  eventSyncedString = 'Event Synced to your calender';
  eventCreatedString = 'Event Added to your calnder';
  eventDeletedString = 'Event Deleted from calnder';
  addString = 'Add';
  deleteString = 'Delete';
  syncString = 'Sync';
  followString = 'Follow with Calander';
  staredString = 'Following';
  timeToRemindString = 'What time you wnat to be Reminded ?';
  addToCanalderString = 'Add event to your calender by click on + Button';
  constructor(
    private navParams: NavParams,
    private calender: Calendar,
    private apiService: ApiService,
    private utilServ: GenralUtilsService,
    private actRouter: ActivatedRoute,
    private navCtrl: NavController,
    private modalController: ModalController) {
    if (!JSON.parse(localStorage.getItem('eventDemo'))) {
      this.demo = true;
    }
    // this.addToCanalderString.replace('+', '<span id="plus" style="font-size: 3em;">+</span>');
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.eventList = this.navParams.get('custom_data');
    this.teamDetailList = this.navParams.get('team_data');
    if (!this.teamDetailList) {
      this.teamDetailList = JSON.parse(localStorage.getItem('teamData'));
    }
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
    // console.log(this.eventList);
  }

  ngOnInit() {

  }
  checkAndAddToCalnder() {
    let date = new Date(this.eventList.event_date);
    let newDateTime: Date;
    let title;
    date.setDate(date.getDate() + 1);
    if (this.alarmTime) {
      const seltedTime = new Date(this.alarmTime);
      const hr = seltedTime.getHours();
      const mn = seltedTime.getMinutes();
      newDateTime = new Date();
      newDateTime.setDate(date.getDate());
      newDateTime.setMonth(date.getMonth());
      newDateTime.setFullYear(date.getFullYear());
      newDateTime.setHours(hr);
      newDateTime.setMinutes(mn);
    }
    if (newDateTime) {
      date = newDateTime;
    }
    let sd = new Date(this.eventList.event_date);
    sd.setDate(sd.getDate() + 1);
    sd.setMinutes(0);
    sd.setHours(0);
    let ed = new Date(sd);
    ed.setMinutes(59);
    ed.setHours(23);
    if (this.eventList.teamname.length > 0) {
      title = (this.eventList.teamname + ': ' + this.eventList.event_title);
    } else {
      title = this.eventList.event_title;
    }

    this.calender.findEvent(
      title,
      this.eventList.event_venue,
      this.eventList.event_description,
      sd,
      ed).then(
        (msgAllready) => {
          if (msgAllready.length > 0) {
            this.utilServ.presentToast(this.eventAlredyString);
          } else {
            this.calender.createEvent(
              title,
              this.eventList.event_venue,
              this.eventList.event_description,
              date,
              date).then(
                (msgCreated) => {
                  this.utilServ.presentToast(this.eventCreatedString);
                  this.apiService.starAddEvent(
                    this.eventList.teamid, this.eventList.id, this.userDetail.id).pipe().subscribe((res: any) => {
                      this.startDetailEvent(this.teamDetailList);
                    });
                });
          }
        });
  }


  checkAndRemoveFromCalnder() {
    let sd = new Date(this.eventList.event_date);
    let title;
    sd.setDate(sd.getDate() + 1);
    sd.setMinutes(0);
    sd.setHours(0);
    let ed = new Date(sd);
    ed.setMinutes(59);
    ed.setHours(23);
    if (this.eventList.teamname.length > 0) {
      title = (this.eventList.teamname + ': ' + this.eventList.event_title);
    } else {
      title = this.eventList.event_title;
    }
    this.calender.deleteEvent(
      title,
      this.eventList.event_venue,
      this.eventList.event_description,
      sd,
      ed).then(
        (msgDeleted) => {
          if (msgDeleted === false) {
            this.utilServ.presentToast(this.eventDoesNotString);
          } else {
            this.utilServ.presentToast(this.eventDeletedString);
            this.apiService.starRemoveEvent(this.eventList.teamid, this.eventList.id, this.userDetail.id).pipe().subscribe((res: any) => {
              // console.log(res);
              this.startDetailEvent(this.teamDetailList);
            });
          }
        });
  }

  updateCal(x) {
    this.apiService.listTeamEvent(this.userDetail.id, x.teamid).subscribe((res: any) => {
      this.resultSync = res.message;
      // console.log(this.resultSync);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.resultSync.length; i++) {
        if (this.resultSync[i].event_title === this.eventList.event_title) {
          this.resultSync = this.resultSync[i];
          this.oldDataSync = this.resultSync.olddata[0];
          this.isSyncedSync = this.resultSync.sync;
          this.isStaredSync = this.resultSync.starred;
          break;
        } else {
          this.resultSync = null;
        }
      }
      // console.log(this.resultSync);

      // old
      let title = this.oldDataSync.title;
      if (this.eventList.teamname.length > 0) {
        title = (this.eventList.teamname + ': ' + this.oldDataSync.title);
      } else {
        title = this.oldDataSync.title;
      }

      // New
      let titleUpdate;
      if (this.eventList.teamname.length > 0) {
        titleUpdate = (this.eventList.teamname + ': ' + this.eventList.event_title);
      } else {
        titleUpdate = this.eventList.event_title;
      }

      // old
      let sd = new Date(this.oldDataSync.event_date);
      sd.setDate(sd.getDate());
      sd.setMinutes(0);
      sd.setHours(0);
      let ed = new Date(sd);
      ed.setMinutes(59);
      ed.setHours(23);
      // console.log("old");
      // console.log(title);
      // console.log(this.oldDataSync.event_description);
      // console.log(this.oldDataSync.event_venue);
      // console.log(sd);
      // console.log(ed);

      // new
      let date = new Date(this.eventList.event_date);
      date.setDate(date.getDate() + 1);
      let sdUpdated = new Date(date);
      sdUpdated.setMinutes(0);
      sdUpdated.setHours(0);
      let edUpdated = new Date(sdUpdated);
      edUpdated.setMinutes(59);
      edUpdated.setHours(23);

      // console.log("New");
      // console.log(titleUpdate);
      // console.log(this.eventList.event_venue);
      // console.log(this.eventList.event_description);
      // console.log(sdUpdated);
      // console.log(edUpdated);
      this.calender.deleteEvent(
        title,
        this.oldDataSync.event_venue,
        this.oldDataSync.event_description,
        sd,
        ed).then(() => {
          this.calender.deleteEvent(titleUpdate,
            this.eventList.event_venue,
            this.eventList.event_description,
            sdUpdated,
            edUpdated).then(() => {
              this.alarmUpdated.open();
            });
        });

    });
  }

  addCal(x) {
    this.alarm.open();
  }
  updateCalender() {
    // New
    let titleUpdate;
    if (this.eventList.teamname.length > 0) {
      titleUpdate = (this.eventList.teamname + ': ' + this.eventList.event_title);
    } else {
      titleUpdate = this.eventList.event_title;
    }
    // new
    let date = new Date(this.eventList.event_date);
    let newDateTime: Date;
    date.setDate(date.getDate() + 1);


    if (this.alarmTimeUpdated) {
      const seltedTime = new Date(this.alarmTimeUpdated);
      const hr = seltedTime.getHours();
      const mn = seltedTime.getMinutes();
      newDateTime = new Date();
      newDateTime.setDate(date.getDate());
      newDateTime.setMonth(date.getMonth());
      newDateTime.setFullYear(date.getFullYear());
      newDateTime.setHours(hr);
      newDateTime.setMinutes(mn);
    }
    if (newDateTime) {
      date = newDateTime;
    }
    let sd = new Date(this.eventList.event_date);
    sd.setDate(sd.getDate() + 1);
    sd.setMinutes(0);
    sd.setHours(0);
    let ed = new Date(sd);
    ed.setMinutes(59);
    ed.setHours(23);
    if (this.eventList.teamname.length > 0) {
      titleUpdate = (this.eventList.teamname + ': ' + this.eventList.event_title);
    } else {
      titleUpdate = this.eventList.event_title;
    }
    this.calender.findEvent(
      titleUpdate,
      this.eventList.event_venue,
      this.eventList.event_description,
      sd,
      ed).then(
        (msgAllready) => {
          if (msgAllready.length > 0) {
            this.utilServ.presentToast(this.eventAlredyString);
          } else {
            this.calender.createEvent(titleUpdate,
              this.eventList.event_venue,
              this.eventList.event_description,
              date,
              date).then(() => {
                this.apiService.starAddEvent(
                  this.eventList.teamid, this.eventList.id, this.userDetail.id).pipe().subscribe((res: any) => {
                    this.startDetailEvent(this.teamDetailList);
                  });
              });
            this.utilServ.presentToast(this.eventSyncedString);
          }
        });
  }
  removeCal(x) {
    this.checkAndRemoveFromCalnder();
  }

  startDetailEvent(data) {
    this.apiService.starStatusEvent(data.teamid, this.eventList.id, this.userDetail.id).pipe().subscribe((res: any) => {
      if (res.message[0]) {
        this.star = res.message[0].stared;
      }
    });
  }

  back() {
    this.modalController.dismiss();
  }
  dismissDemo() {
    this.demo = false;
    localStorage.setItem('eventDemo', 'true');
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.eventTitleString = this.utilServ.getLangByCode('event_title');
      this.VieweventTitleString = this.utilServ.getLangByCode('view_event');
      this.eventDescString = this.utilServ.getLangByCode('event_desc');
      this.eventVenueString = this.utilServ.getLangByCode('event_venue');
      this.eventAlredyString = this.utilServ.getLangByCode('eventAlredy');
      this.eventDoesNotString = this.utilServ.getLangByCode('eventDoesNot');
      this.eventSyncedString = this.utilServ.getLangByCode('eventSynced');
      this.eventCreatedString = this.utilServ.getLangByCode('eventCreated');
      this.eventDeletedString = this.utilServ.getLangByCode('eventDeleted');
      this.addString = this.utilServ.getLangByCode('add');
      this.deleteString = this.utilServ.getLangByCode('delete');
      this.syncString = this.utilServ.getLangByCode('syncString');
      this.followString = this.utilServ.getLangByCode('followString');
      this.staredString = this.utilServ.getLangByCode('following');
      this.addToCanalderString = this.utilServ.getLangByCode('events.label.addEventHint');
      this.timeToRemindString = this.utilServ.getLangByCode('timeToRemindString');
    }
  }
}
