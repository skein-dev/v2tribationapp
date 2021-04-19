import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.page.html',
  styleUrls: ['./help-center.page.scss'],
})
export class HelpCenterPage implements OnInit {
  contactinfo: any;

  // Strings
  helpcenterString = 'help center';
  bussinessInquiryString = 'Business Inquiry';
  reportProblemString = 'Report a Problem';
  generalInquiryString = 'General Inquiry';
  suggestionsString = 'Suggestions';

  constructor(
    private location: Location,
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService,
  ) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
    this.apiService.contactus().pipe().subscribe((res: any) => {
      // console.log(res.message.info);
      this.contactinfo = res.message.info;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.contactinfo.length; i++) {
        this.contactinfo[i].headingLanguage = this.contactinfo[i].headingLanguage || '';
        this.contactinfo[i].image = this.contactinfo[i].image || '';
        this.contactinfo[i].image1 = this.contactinfo[i].image || '';

        if (this.contactinfo[i].heading === 'Business Inquiry') {
          this.contactinfo[i].headingLanguage = this.bussinessInquiryString;
          this.contactinfo[i].image = 'suitcase.png';
          this.contactinfo[i].image1 = 'email.png';
        }
        else if (this.contactinfo[i].heading === 'Report a Problem') {
          this.contactinfo[i].headingLanguage = this.reportProblemString;
          this.contactinfo[i].image = 'contract.png';
          this.contactinfo[i].image1 = 'email.png';
        }
        else if (this.contactinfo[i].heading === 'General Inquiry') {
          this.contactinfo[i].headingLanguage = this.generalInquiryString;
          this.contactinfo[i].image = 'customer-service.png';
          this.contactinfo[i].image1 = 'email.png';
        }
        else if (this.contactinfo[i].heading === 'Suggestions') {
          this.contactinfo[i].headingLanguage = this.suggestionsString;
          this.contactinfo[i].image = 'feedback.png';
          this.contactinfo[i].image1 = 'email.png';
        }
      }
    });

  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.utilServ.checkUserExists();
  }

  back() {
    this.location.back();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.helpcenterString = this.utilServ.getLangByCode('help_cent');
      this.bussinessInquiryString = this.utilServ.getLangByCode('bussiness_inquiry');
      this.reportProblemString = this.utilServ.getLangByCode('report_problem');
      this.generalInquiryString = this.utilServ.getLangByCode('general_inquiry');
      this.suggestionsString = this.utilServ.getLangByCode('suggestions');
    } else {
      this.utilServ.checkBasicElseRelodApp();
    }
  }
}
