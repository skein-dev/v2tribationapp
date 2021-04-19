import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {

  userDetail;

  // Strings
  thanksForLoyaltyString = 'We would like to thank you for your loyalty to Tribation, and thus we offer you an exclusive chance to win US$100 !!';
  loyaltyDescString = 'All you have to do is post 5 images/videos and We will be selecting 10 people randomly out of the 1000 users to win US$100 each';
  goodLuckString = 'Good luck!';
  promoConstString = 'Promotional Contest';
  welcomeToString = 'Welcome to';

  constructor(private modalController: ModalController,
    private utilServ: GenralUtilsService) {
    this.getLanguageStrings();
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
  }


  ngOnInit() { }
  onClickContinue() {
    this.modalController.dismiss();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.thanksForLoyaltyString = this.utilServ.getLangByCode('thanksForLoyaltyString');
      this.loyaltyDescString = this.utilServ.getLangByCode('loyaltyDescString');
      this.goodLuckString = this.utilServ.getLangByCode('goodLuckString');
      this.promoConstString = this.utilServ.getLangByCode('promoConstString');
      this.welcomeToString = this.utilServ.getLangByCode('welcomeToString');
    }
  }
}
