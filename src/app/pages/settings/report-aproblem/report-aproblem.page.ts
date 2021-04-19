import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-aproblem',
  templateUrl: './report-aproblem.page.html',
  styleUrls: ['./report-aproblem.page.scss'],
})
export class ReportAProblemPage implements OnInit {
  reportProblm: FormGroup;
  report;
  userDetail;
  prblemData: any;
  repotdesc: any;
  reportprblm;
  // Strings
  reportString = 'Report';
  reportSpamAbuseString = 'Report spma or abuse';
  reportProblemString = 'Report a problem';
  describeHereString = 'Describe Here';
  submitString = 'Submit';
  cancelString = 'Cancel';
  selectString = 'Select';
  thnaksForYourReportWeWillWorkOnItString = 'Thank you for submiting the report, we will take action soon';
  constructor(
    private location: Location,
    private actRouter: ActivatedRoute,
    private apiService: ApiService,
    private utilServ: GenralUtilsService,) {
    this.actRouter.queryParams.subscribe(xd => {
      this.setUpBasicDetails();
    });
  }

  ngOnInit() {
    this.setUpBasicDetails();
  }

  ionViewWillEnter() {
    this.utilServ.checkUserExists();
    this.setUpBasicDetails();
  }

  setUpBasicDetails() {
    this.repotdesc = '';
    this.reportprblm = '';
    this.reportProblm = new FormGroup({
      selectreport: new FormControl('', [Validators.required]),
      reportdesc: new FormControl('', [Validators.required])
    });
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.utilServ.checkUserExists();
    if (this.utilServ.langSetupFLag) {
      this.reportString = this.utilServ.getLangByCode('report');
      this.reportSpamAbuseString = this.utilServ.getLangByCode('report_spam_abuse');
      this.reportProblemString = this.utilServ.getLangByCode('report_problem');
      this.describeHereString = this.utilServ.getLangByCode('describe_here');
      this.submitString = this.utilServ.getLangByCode('submit');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.selectString = this.utilServ.getLangByCode('select');
      // this.thnaksForYourReportWeWillWorkOnItString = this.utilServ.getLangByCode('');
    } else {
      this.utilServ.checkBasicElseRelodApp();
    }
  }
  openSpamModal() {
    this.report = true;
  }
  clickedStar() {
    this.apiService.reportCommon(this.userDetail.id, this.prblemData, this.repotdesc).pipe().subscribe((res: any) => {
      if (res.success === 1) {
        this.utilServ.okButtonMessageAlert(this.thnaksForYourReportWeWillWorkOnItString).then(() => {
          this.repotdesc = '';
          this.reportprblm = '';
        }
        );
      }
    });
  }
  reportChange(data) {
    this.prblemData = data;
  }

  openProblemModal() {
    this.report = true;
  }
  back() {
    this.location.back();
  }
}
