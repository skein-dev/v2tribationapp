import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-team-event',
  templateUrl: './add-team-event.component.html',
  styleUrls: ['./add-team-event.component.scss'],
})
export class AddTeamEventComponent implements OnInit {
  teamData: any;
  disableBtn = true;
  eventTitle = '';
  eventVenu = '';
  eventDescription = '';
  eventDate = '';
  minDate;
  maxDate;
  userDetail;

  addEventString = 'Add Event';
  eventTitleString = 'Event Title';
  eventDescString = 'Event Description';
  eventDateString = 'Date';
  eventVenueString = 'Venue';
  submitString = 'Submit';
  addToCanalderString = 'What time you wnat to be  + Reminded';

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {

    this.teamData = JSON.parse(localStorage.getItem('teamData'));
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.minDate = this.utilServ.minToday();
    this.maxDate = this.utilServ.max5yeras();
    this.eventTitle = '';
    this.eventVenu = '';
    this.eventDescription = '';
    this.eventDate = '';
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
    // this.apiService.getTeamMembers(this.teamData.teamid).pipe().subscribe((res: any) => {
    //   // this.teammembers = res.message;
    // });
  }

  ngOnInit() {

  }
  back() {
    this.modalController.dismiss();
  }
  venuValid() {
    this.eventVenu = this.eventVenu.trim();
    this.eventVenu = this.utilServ.formatString(this.eventVenu);
    this.x();
  }
  descValid() {
    this.eventDescription = this.eventDescription.trim();
    this.eventDescription = this.utilServ.formatString(this.eventDescription);
    this.x();

  }
  titleValid() {
    this.eventTitle = this.eventTitle.trim();
    this.eventTitle = this.utilServ.formatString(this.eventTitle);
    this.x();
  }
  x() {
    if (this.eventTitle === '' || this.eventDate === '' || this.eventVenu === '' || this.eventDescription === '' ||
      !this.eventTitle || !this.eventDate || !this.eventVenu || !this.eventDescription) {
      this.disableBtn = true;
    } else {
      this.disableBtn = false;
    }
  }
  setFocus(nextElement) {
    // console.log(nextElement);
    nextElement.setFocus();
  }
  eventAdd() {
    const dateTemp = this.utilServ.getYYYY_MM_DD(this.eventDate);
    this.apiService.addTeamEvent(
      this.userDetail.id,
      this.teamData.teamid,
      this.eventTitle,
      this.eventDescription,
      dateTemp,
      this.eventVenu,
      this.teamData.team_name).pipe().subscribe((res: any) => {
        if (res.sucess === 1) {
          this.eventTitle = '';
          this.eventDescription = '';
          this.eventDate = '';
          this.eventVenu = '';
        }
        this.back();
        // this.events.publish("createTeam");
        // this.socket.emit("team-create-event", {
        //   user_id: this.userDetail.id,
        //   teamid: this.teamDetail.teamid,
        //   teamname: this.teamDetail.team_name,
        //   eventname: this.title, teammember: this.teammembersid,
        //   username: this.userDetail.first_name,
        // })
      });
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.addToCanalderString = this.addToCanalderString.replace('+', 'document.createElement("BUTTON")');

      this.addEventString = this.utilServ.getLangByCode('add_event');
      this.eventTitleString = this.utilServ.getLangByCode('event_title');
      this.eventDescString = this.utilServ.getLangByCode('event_desc');
      this.eventDateString = this.utilServ.getLangByCode('event_date');
      this.eventVenueString = this.utilServ.getLangByCode('event_venue');
      this.submitString = this.utilServ.getLangByCode('submit');
    }
  }
}
