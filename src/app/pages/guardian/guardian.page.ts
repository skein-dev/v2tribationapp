import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from '../../../environments/environment';
import { AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { EventsCustomService } from '../../services/events-custom.service';

@Component({
  selector: 'app-guardian',
  templateUrl: './guardian.page.html',
  styleUrls: ['./guardian.page.scss'],
})
export class GuardianPage implements OnInit {

  environment: any;
  noMinor = false;
  minorList: any[] = [];
  filteredMinorList: any[] = [];
  userDetail: any;
  countryData: any;

  guardinaToolString = 'Guardian Tool';
  noMinorString = 'You have no minors';
  discardMinorString = 'Discard';
  discardConfirmString = 'Are you sure you want to discard this minor?';
  cancelString = 'cancel';
  yesString = 'yes';
  searchString = 'Search';

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    public socketAPI: Socket,
    private apiService: ApiService,
    private eventCustom: EventsCustomService,
    private alertController: AlertController,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.countryData = this.utilServ.getCountryList();
      this.apiService.getGuardedAthletes(this.userDetail.id).subscribe((res: any) => {
        if (res) {
          if (res.message.length > 0) {
            this.minorList = res.message;
            this.filteredMinorList = this.minorList;
            if (this.filteredMinorList !== null && this.countryData) {
              this.getCountryNameFromCode();
            }
          } else {
            this.utilServ.navTimeline();
          }
        }
      });
    });
  }
  getCountryNameFromCode() {
    this.filteredMinorList.forEach(element => {
      // console.log(element);
      const xDx = this.countryData.filter(d => d.CC_ISO === element.country_code);
      if (xDx[0]) {
        element.country = xDx[0].COUNTRY_NAME;
      }
    });
  }
  goToProfile(id) {
    this.router.navigate([`profile/${id}`]);
  }
  ngOnInit() {
    this.environment = environment;
  }
  async cancelGuardreq(reqId, n) {
    const alert = await this.alertController.create({
      message: this.discardConfirmString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: this.yesString,
          handler: () => {
            this.apiService.cancelGuardianConnection(this.userDetail.id, reqId).subscribe((res: any) => {
              if (res.success === 1) {
                this.filteredMinorList.splice(n, 1);
                this.utilServ.getMyMinors(this.userDetail.id);
                this.utilServ.getUserStatus(this.userDetail.id);
                const data = {
                  athleteUserId: reqId,
                  guardianUserId: this.userDetail.id,
                  userId: this.userDetail.id
                };
                this.socketAPI.emit('guardian-cancel-link', data);
                this.getMyMinor();
                // this.getProfileDataOfUser();
              } else {
                // Toast Message
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  getMyMinor() {
    this.apiService.getGuardedAthletes(this.userDetail.id).subscribe((res: any) => {
      if (res) {
        if (res.message.length > 0) {
          this.eventCustom.publish('showGuardianTool', true);
        } else {
          this.eventCustom.publish('showGuardianTool', false);
        }
      }
    });
  }
}
