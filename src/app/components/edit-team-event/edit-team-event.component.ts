import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-team-event',
  templateUrl: './edit-team-event.component.html',
  styleUrls: ['./edit-team-event.component.scss'],
})
export class EditTeamEventComponent implements OnInit {
  @ViewChild('alarm') alarm;
  @ViewChild('a', { static: false }) eveTitleSelector: Input;
  @ViewChild('c') eveVenuSelector: any;
  customPickerOptions: any;
  selectedEvent: any;
  teammembers: any;
  teamData: any;
  userDetail: any;
  eveTitle;
  eveDec;
  eveDate;
  eveVenue;
  eveteamName;
  maxDate;
  calDate;

  // Strings
  editEventTitleString = 'Edit Event';
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
  submitString = 'Submit';
  timeToRemindString = 'What time you wnat to be Reminded ?';
  cancelString = 'Cancel';
  doneString = 'Done';


  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {


    this.actRouter.queryParams.subscribe(dta => {
      this.teamData = JSON.parse(localStorage.getItem('teamData'));
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.selectedEvent = this.navParams.get('custom_data');
      this.eveTitle = this.selectedEvent.event_title;
      this.eveDec = this.selectedEvent.event_description;
      this.eveDate = this.selectedEvent.event_date;
      this.eveVenue = this.selectedEvent.event_venue;
      this.eveteamName = this.selectedEvent.teamname;
      this.maxDate = this.utilServ.max5yeras();
      this.getLanguageStrings();
    });
  }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.setFocus(this.eveTitleSelector);
  }
  updateEveDate() {
    this.setFocus(this.eveVenuSelector);
    this.eveDate = this.utilServ.getYYYY_MM_DD(this.calDate);
  }
  submitEiditedEve() {
    this.apiService.updateTeamEvent(
      this.userDetail.id,
      this.teamData.id,
      this.eveTitle,
      this.eveDec,
      this.eveDate,
      this.eveVenue,
      this.selectedEvent.id).pipe().subscribe((res: any) => {
        if (res.success === 1) {
          this.back();
        }
      });
  }
  setFocus(nextElement) {
    setTimeout(() => {
      nextElement.setFocus();
    }, 150);
  }
  back() {
    this.modalController.dismiss();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.editEventTitleString = this.utilServ.getLangByCode('edit') + this.utilServ.getLangByCode('event');
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
      this.submitString = this.utilServ.getLangByCode('submit');
      this.timeToRemindString = this.utilServ.getLangByCode('timeToRemindString');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.doneString = this.utilServ.getLangByCode('done');
    }
  }
}
