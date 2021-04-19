// import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-intro-language',
  templateUrl: './intro-language.component.html',
  styleUrls: ['./intro-language.component.scss'],
})
export class IntroLanguageComponent implements OnInit {
  tribLanguages: [];
  languagevalue;
  langLibrary = null;

  // Strings
  languageString = 'Language';
  okString = 'Ok';
  constructor(private utilServ: GenralUtilsService,
    // private location: Location,
    private actRouter: ActivatedRoute,
    private modalController: ModalController,
    private apiService: ApiService) {
    this.actRouter.queryParams.subscribe(() => {
      this.languagevalue = (localStorage.getItem('profileLang') || 'english');

      this.getLanguages();
    });
  }

  ngOnInit() {
    // this.languagevalue = localStorage.getItem('profileLang');
    // if (this.utilServ.langSetupFLag) {
    //   this.languageString = this.utilServ.getLangByCode('language');
    //   this.okString = this.utilServ.getLangByCode('ok');
    // } else {
    //   this.utilServ.checkBasicElseRelodApp();
    // }
  }
  ionViewWillEnter() {
    this.getLanguages();
  }
  getLanguages() {
    // this.apiService.connectFuntion();
    this.apiService.tribationLanguages().subscribe((res: any) => {
      // this.apiService.connectFuntion();
      if (res) {
        this.tribLanguages = res.message;
        // for (let g = 0; g < this.tribLanguages.length; g++) {
        //   if (this.tribLanguages[g].status === 1) {
        //     this.tribLanguages[g].status = false;
        //   } else {
        //     this.tribLanguages[g].status = true;
        //   }
        // }
        console.log(":::::::", this.tribLanguages)
      }
      // if (this.tribLanguages) {
      //  tslint:disable-next-line: prefer-for-of

      //   this.utilServ.hideLoaderWaitAMin();
      // } else {
      //   this.apiService.connectFuntion();
      //   this.getLanguages();
      //   this.utilServ.hideLoaderWaitAMin();
      // }
    });
  }

  changeLanguage(toThis) {
    const toCheck = localStorage.getItem('profileLang');
    console.log(toThis);
    localStorage.setItem('profileLang', toThis);
    localStorage.setItem('langSetupFLag', "false");
    this.apiService.languageFile(toThis).subscribe((res: any) => {
      this.apiService.connectFuntion();
      if (res.success === 1) {
        this.langLibrary = res.message.Sheet1;
        localStorage.setItem('languageSetup', JSON.stringify(this.langLibrary));
        localStorage.setItem('langSetupFLag', "true");
        window.location.reload();
      }
    }, error => {
      localStorage.setItem('online', 'false');
    });
    this.back();
  }
  back() {
    this.modalController.dismiss({
      dismissed: true,
      data: null
    });
  }
}

