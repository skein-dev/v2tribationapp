import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-guardian-terms',
  templateUrl: './guardian-terms.component.html',
  styleUrls: ['./guardian-terms.component.scss'],
})
export class GuardianTermsComponent implements OnInit {

  gaurdName = 'Gurdian';
  minorName = 'Minor';
  termsContent: string;
  termsString = 'Terms and Conditions';
  iAccpetTermsString = 'I Accept these terms';
  checkAcceptedTerms = false;

  constructor(
    private utilServ: GenralUtilsService,
    private modalController: ModalController) {
    const names = JSON.parse(localStorage.getItem('namesForAgreementGuard'));
    this.gaurdName = names.guardName;
    this.minorName = names.minorName;
    let termms = '<h1>GUARDIAN CONSENT AGREEMENT</h1><h4> This Guardian Consent Agreement (this “Agreement”), effective as of _%d_, between Tribation Inc. (owner and operator of “Tribation” social media website and mobile applications) and participant _%m_ and Guardian _%g_ is made with reference to the following:</h4><h5><li> I, the guardian _%g_ hereby warrant and represent that I am the legal guardian of the participant  _%m_ and I am responsible for the care, custody, and control of the aforementioned minor participant.</li><li> I, the guardian  _%g_ represent and warrant that no other person’s authorization is required to grant the rights herein, and I, the guardian _%g_ have full authority to consent to minor’s _%m_ participation in the “Tribation” social media platforms such as Tribation’s website and mobile applications.</li><li> I, the guardian _%g_ acknowledge that I have read, understood, and agreed to all of the terms, conditions, grants and waivers contained in this agreement. I, the guardian  _%g_hereby represent, warrant, and guaranties that neither I, the guardian _%g_ nor the participant, will disaffirm this Agreement at any time as a participant or as an adult.</li></h5><h5> <b> I, the guardian _%g_ hereby consent for the minor named _%m_ to sign up and create a sportsman/athlete profile within “Tribation Social Media Platforms” such as the website and mobile application(s) by disclosing his/her personal information such as age, height, weight, and disclose his/her location city – country and share, post his/her pictures, photos, videos in Tribation Platforms. </b></h5> <small> I, the guardian agree that this agreement/consent shall be governed by and interpreted in accordance with the law of the province of Ontario, Canada. The parties consent to the jurisdiction of the local and federal courts of Canada </small>';
    if (this.utilServ.langSetupFLag) {
      termms = this.utilServ.getLangByCode('common.guardian.agreement');
    }
    const timesGuard = this.occurrences(termms, '_%g_', false);
    const timesMinor = this.occurrences(termms, '_%m_', false);
    for (let i = 0; i < timesGuard; i++) {
      termms = termms.replace('_%g_', `${this.gaurdName}`);
    }

    for (let i = 0; i < timesMinor; i++) {
      termms = termms.replace('_%m_', `${this.minorName}`);
    }
    let dateToday: string = this.utilServ.minToday();
    termms = termms.replace('_%d_', `${dateToday}`)

    this.termsContent = termms;
  }
  ngOnInit() {
    this.setTrems();

  }
  setTrems() {
    // if (this.utilServ.langSetupFLag) {
    //   this.termsContent = this.utilServ.getLangByCode('terms_content');
    //   this.termsString = this.utilServ.getLangByCode('termsaccept_1');
    // }
  }
  goback() {
    this.modalController.dismiss(this.checkAcceptedTerms);
  }
  addValue() {
    this.checkAcceptedTerms = !this.checkAcceptedTerms;
  }

  occurrences(stng, subString, allowOverlapping) {
    stng += '';
    subString += '';
    if (subString.length <= 0) { return (stng.length + 1); }
    let n = 0;
    let pos = 0;
    const step = allowOverlapping ? 1 : subString.length;
    while (true) {
      pos = stng.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else { break; }
    }
    return n;
  }
}
