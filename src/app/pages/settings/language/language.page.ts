import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {
  tribLanguages;
  languagevalue;
  // Strings
  languageString = 'Langua';
  okString = 'Ok';
  userDetail: any;
  constructor(
    private utilServ: GenralUtilsService,
    private location: Location,
    private actRouter: ActivatedRoute,
    private apiService: ApiService,) {
    this.actRouter.queryParams.subscribe(() => {
      if (!this.tribLanguages) {
        this.getLanguages();
        this.utilServ.showLoaderWait();
      }
    });
  }

  ngOnInit() {
    this.languagevalue = localStorage.getItem('profileLang');
    if (this.utilServ.langSetupFLag) {
      this.languageString = this.utilServ.getLangByCode('language');
      this.okString = this.utilServ.getLangByCode('ok');
    } else {
      this.utilServ.checkBasicElseRelodApp();
    }
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
  }
  ionViewWillEnter() {
    this.utilServ.checkUserExists();
    this.getLanguages();
  }
  getLanguages() {
    this.apiService.connectFuntion();
    this.apiService.tribationLanguages().pipe().subscribe((res: any) => {
      this.apiService.connectFuntion();
      this.tribLanguages = res.message;
      if (this.tribLanguages) {
        //  tslint:disable-next-line: prefer-for-of
        for (let g = 0; g < this.tribLanguages.length; g++) {
          if (this.tribLanguages[g].status === 1) {
            this.tribLanguages[g].status = false;
          } else {
            this.tribLanguages[g].status = true;
          }
        }
        this.utilServ.hideLoaderWaitAMin();
      } else {
        this.apiService.connectFuntion();
        this.getLanguages();
        this.utilServ.hideLoaderWaitAMin();
      }
    });
  }

  changeLanguage(toThis) {
    const toCheck = localStorage.getItem('profileLang');

    if (toCheck === toThis) {
      let str = toThis;
      str = str ? str.charAt(0).toUpperCase() + str.substr(1).toLowerCase() : '';
      this.utilServ.okButtonMessageAlert('You already using ' + str + ' as your current language');
    } else {
      this.apiService.connectFuntion();
      this.apiService.saveChangedLanguage(this.userDetail.id, toThis).pipe().subscribe((res: any) => {
        this.apiService.connectFuntion();
        localStorage.removeItem('userdetail');
        localStorage.removeItem('profileLang');

        this.userDetail.language = toThis;
        this.utilServ.userDetail = null;
        this.utilServ.showLoaderWait();
        localStorage.setItem('userdetail', JSON.stringify(this.userDetail));
        localStorage.setItem('profileLang', toThis);
        localStorage.removeItem('languageSetup');
        this.utilServ.langSetupFLag = false;
        this.utilServ.langLibrary = null;

        this.utilServ.setUpUser();
        this.utilServ.initLang();
        this.apiService.reloadApp();

        setTimeout(() => {
          if (this.utilServ.langSetupFLag) {
            this.utilServ.resetDefaults();
            this.utilServ.hideLoaderWaitAMin();
            this.utilServ.setUpUser();
            this.back();

          }
        }, 4500);
      });
    }
  }

  back() {
    this.location.back();
    this.utilServ.hideLoaderWaitAMin();
  }
}
