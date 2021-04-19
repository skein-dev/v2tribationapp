import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { Socket } from 'ngx-socket-io';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from '../../../../environments/environment';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { FcmServiceService } from '../../../services/fcm-service.service';

const PRODUCT_YEAR_KEY = 'autosub3';   // 3 months
const PRODUCT_MONTH_KEY = 'autosub1Mon';   // 1 month
const PRODUCT_FREE_KEY = 'trialMonthly';  // free 1 weekk


@Component({
  selector: 'app-subscribing-plan',
  templateUrl: './subscribing-plan.page.html',
  styleUrls: ['./subscribing-plan.page.scss'],
})

export class SubscribingPlanPage implements OnInit {

  @ViewChild('monthYear') monthYear: any;
  @ViewChild('secrete') secrete: any;
  @ViewChild('userName') userName: any;
  products: IAPProduct[] = [];

  cardNumber: string;
  expiry: string;
  showWas = true;
  environment;
  cvv;
  link = '';
  userDetail;
  closeString = 'Close';
  getSubscriptionString = 'Buy Subscription';
  buyStatusString = 'Congratulations...! Now you are a certified "Tribation" Scout.';
  congString = 'Congratulations !';
  scoutStatus;

  // checkoutString = 'Make Payment';
  approveBeingScoutString = 'You are aproved for being a scout.';
  selectPlanString = 'Select your plan to start your search journey for Athlets';
  cardHolderNameString = 'Cardholder\'s Name';
  freeSubsPlan = '1 Week Trial Free*';
  monthlySubsPlan = 'Monthly - $169.99 USD';
  threeMonthsPlan = '3 Months - $399.99 USD';
  yearActualSubsPlan = 'Yearly - $3,588 USD';
  wasString = 'Was';
  commingSoonString = 'Feature comming with the next release!';
  plan: string;
  displayMoney = '$399.99';
  youGetMailAsWellString = 'Selection has been locked for the payment,you pay either from this button or from the link we sent to your verified email address';

  areYouSureString = 'Activate';
  doYouWantLogoutString = 'Please login to activate scout features';
  cancelString = 'cancel';
  yesString = 'yes';
  scoutToolString = 'Scout Tool';
  constructor(
    public platform: Platform,
    private store: InAppPurchase2,
    private actRouter: ActivatedRoute,
    private apiService: ApiService,
    private payPal: PayPal,
    private router: Router,
    private socket: Socket,
    private fcmService: FcmServiceService,
    private utilServ: GenralUtilsService,
    private eventCustom: EventsCustomService,
    private ref: ChangeDetectorRef,
    private menu: MenuController,
    private alertController: AlertController) {

    this.actRouter.queryParams.subscribe(() => {
      this.products = [];

      const zy = setInterval(() => {
        this.scoutStatus = this.utilServ.getScoutStatus();
        if (this.scoutStatus === true || this.scoutStatus === false) {
          clearInterval(zy);
          if (this.scoutStatus === true) {
            this.router.navigate(['/scouts']);
          } else {
            console.log('this is false');
          }
        }
      }, 5);
      this.getLanguageStrings();

      if (this.platform.is('ios') === true) {
        this.platform.ready().then(() => {
          // Only for debugging!
          this.store.verbosity = this.store.DEBUG;
          this.registerProducts();
          this.setupListeners();
          // Get the real product information
          this.store.ready(() => {
            this.products = this.store.products;
            console.log('P::::::::::::::::::::::', this.products);
            this.products.pop();
            this.ref.detectChanges();
          });
        })
      }
    });
    this.socket.on('scout-update-payment-status', (data) => {
      if (data) {
        const status = data.status;
      }
    });
  }

  ngOnInit() {
    this.displayMoney = '$399.99';
    this.closeString = 'Close';
    this.getSubscriptionString = 'Buy Subscription';
    this.buyStatusString = 'Congratulations...! Now you are a certified "Tribation" Scout.';
    this.congString = 'Congratulations !';
    // this.checkoutString = 'Make Payment';
    this.approveBeingScoutString = 'You are aproved for being a scout.';
    this.selectPlanString = 'Select your plan to start your search journy for Athlets';
    this.cardHolderNameString = 'Cardholder\'s Name';
    this.freeSubsPlan = '1 Week Trial Free*';
    this.monthlySubsPlan = 'Monthly - $169.99 USD';
    this.threeMonthsPlan = '3 Months - $399.99 USD';
    this.yearActualSubsPlan = 'Yearly - $3,588 USD';
    this.wasString = 'Was';
    this.commingSoonString = 'Feature comming with the next release!';
  }
  ionViewWillEnter() {
    this.environment = environment;
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.apiService.getScoutFilePaymentStatus(this.userDetail.id).subscribe((res: any) => {
      if (res.message.fileCount === 2 && res.message.paymentDetails === this.userDetail.id) {
        this.apiService.getScoutPaymentStatus(this.userDetail.id).subscribe((res: any) => {
          if (res.message.status === 1 && res.message.mode !== null) {
            this.router.navigate(['/scouts']);
          }
        });
      }
    });
    this.plan = 'year';
  }

  cardnumberInput(x: string) {
    if (x.length === 4 || x.length === 9 || x.length === 14) {
      this.cardNumber = this.cardNumber + '-';
    } else if (x.length === 19) {
      this.moveFocus(this.monthYear);
    }
  }

  expiryInput(x: string) {
    // console.log('>', x, '<');
    if (x.length === 2) {
      this.expiry = this.expiry + '/';
    } else if (x.length === 7) {
      this.moveFocus(this.secrete);
    }
  }
  secreteInput(x) {
    if (x.length === 3) {
      this.moveFocus(this.userName);
    }
  }
  planChange(p) {
    switch (p) {
      case 'year': {
        this.showWas = true;
        this.displayMoney = '$399.99';
        break;
      }

      case 'month': {
        this.showWas = false;
        this.displayMoney = '$169.99';
        break;
      }

      case 'free': {
        this.showWas = false;
        this.displayMoney = '$0';
        break;
      }

      default: {
        break;
      }
    }
    this.buyNow();
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }
  registerProducts() {
    this.store.register({
      id: PRODUCT_YEAR_KEY,
      type: this.store.CONSUMABLE,
    });

    this.store.register({
      id: PRODUCT_MONTH_KEY,
      type: this.store.CONSUMABLE,
    });
    this.store.register({
      id: PRODUCT_FREE_KEY,
      type: this.store.NON_CONSUMABLE,
    });

    this.store.refresh();
  }
  setupListeners() {
    // General query to all products
    this.store.when('product')
      .approved((p: IAPProduct) => {
        // Handle the product deliverable
        if (p.id === PRODUCT_MONTH_KEY) {
          // console.log('Handle the product deliverable::::PRODUCT_MONTH_KEY', p)
          // this.createScoutPaymentRecord(p.transaction.id, this.utilServ.getTimeStamp(),this.userDetail.id, 1, 1);
        } else if (p.id === PRODUCT_YEAR_KEY) {
          // console.log('Handle the product deliverable::::PRODUCT_YEAR_KEY', p)

          // this.createScoutPaymentRecord(p.transaction.id, this.utilServ.getTimeStamp(),this.userDetail.id, 2, 1);
        } else if (p.id === PRODUCT_FREE_KEY) {
          // console.log('Handle the product deliverable::::PRODUCT_FREE_KEY', p)
          // this.createScoutPaymentRecord(p.transaction.id, this.utilServ.getTimeStamp(),this.userDetail.id, 0, 1);
        }
        this.ref.detectChanges();
        return p.verify();
      })
      .verified((p: IAPProduct) => {
        // alert('Approved');
        // console.log('data in approved::::::::::::::::::', p);
        p.finish();
      })
    // Specific query for one ID
    this.store.when(PRODUCT_MONTH_KEY).owned((p: IAPProduct) => {
      // this.createScoutPaymentRecord(p.transaction.id, this.utilServ.getTimeStamp(),this.userDetail.id, 1, 1);
      //  alert('Owned true 1');
      // this.isPro = true;
    });
    this.store.when(PRODUCT_YEAR_KEY).owned((p: IAPProduct) => {
      // this.createScoutPaymentRecord(p.transaction.id, this.utilServ.getTimeStamp(),this.userDetail.id, 2, 1);
      // alert('Owned true 2');
      // this.isPro = true;
    });
    this.store.when(PRODUCT_FREE_KEY).owned((p: IAPProduct) => {
      //  this.createScoutPaymentRecord(p.transaction.id, this.utilServ.getTimeStamp(),this.userDetail.id, 0, 1);
      //  alert('Owned true 3');
      // this.isPro = true;
    });
  }
  purchase(product: IAPProduct) {
    let self = this.store;
    this.store.order(product).then(p => {
      // alert('purchased');
      console.log('p:::::::::::::::::::::Purchased', p);
      // Purchase in progress!
    }, e => {
      this.presentAlert('Failed', `Failed to purchase: ${e}`);
    });
    this.store.when(product).updated(function (product) {
      if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
        product.finish();
      }
    });
    this.store.when(product).registered((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
    });
    this.store.when(product).owned((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
      product.finish();
    });
    this.store.when(product).approved((product: IAPProduct) => {
      this.createScoutPaymentRecord(product.transaction.id, this.utilServ.getTimeStamp(), this.userDetail.id, 1, 1);
      // alert('approved product');
      product.finish();
    });
    this.store.when(product).refunded((product: IAPProduct) => {
      // alert('refunded');
    });
    this.store.when(product).expired((product: IAPProduct) => {
      // alert('expired');
    });
  }

  // To comply with AppStore rules
  restore() {
    this.store.refresh();
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.closeString = this.utilServ.getLangByCode('close');
      this.getSubscriptionString = this.utilServ.getLangByCode('scout.label.buySubscription');
      this.buyStatusString = this.utilServ.getLangByCode('scout.label.buyStatus');
      this.congString = this.utilServ.getLangByCode('scout.label.congratulations');
      this.approveBeingScoutString = this.utilServ.getLangByCode('scout.label.youAreApproved');
      this.selectPlanString = this.utilServ.getLangByCode('scout.label.selectPlan');
      this.cardHolderNameString = this.utilServ.getLangByCode('scout.label.cardHolderName');
      this.freeSubsPlan = this.utilServ.getLangByCode('scout.label.freeSubPlan');
      this.monthlySubsPlan = this.utilServ.getLangByCode('scout.label.monthlySubPlan');
      this.threeMonthsPlan = this.utilServ.getLangByCode('scout.label.yearSubPlan');
      this.yearActualSubsPlan = this.utilServ.getLangByCode('scout.label.yearActualSubPlan');
      this.wasString = this.utilServ.getLangByCode('scout.label.previousPriceWas');
      this.commingSoonString = this.utilServ.getLangByCode('scout.label.commingSoon');
      this.youGetMailAsWellString = this.utilServ.getLangByCode('scout.label.subscribtionPaymentMail');
    }
  }
  continueSelection(mode) {

  }

  buyNow() {
    let mode = 0;
    switch (this.plan) {
      case 'year': {
        mode = 2;
        break;
      }

      case 'month': {
        mode = 1;
        break;
      }

      case 'free': {
        mode = 0;
        break;
      }

      default: {
        break;
      }
    }
    this.apiService.payNowEmailLink(this.userDetail.id, mode).subscribe(() => {
      this.link = `${this.environment.apiUrl}#!/payments?mode=${mode}&userId=${this.userDetail.id}`;
      this.utilServ.okButtonMessageAlert(this.youGetMailAsWellString);
    });
  }
  async logout() {
    this.eventCustom.destroy('userDetail');
    const alert = await this.alertController.create({
      header: this.areYouSureString,
      message: this.doYouWantLogoutString,
      buttons: [
        {
          text: this.cancelString,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.menu.close();
          }
        }, {
          text: this.yesString,
          handler: () => {
            this.menu.close();
            // this.loggedout = true;
            this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
            this.socket.emit('socketDisconnect', { id: this.userDetail.tokenid });
            const lastLoginUser = JSON.parse(localStorage.getItem('lastLoginUser'));
            if (lastLoginUser.age > 18) {
              this.utilServ.getMyMinors(lastLoginUser.id);
            }
            const myMinor = JSON.parse(localStorage.getItem('myMinors'));
            const tokenlog = JSON.parse(localStorage.getItem('userdetail'));
            this.apiService.logout(tokenlog.token).subscribe((res: any) => {
              alert.dismiss();
              localStorage.clear();
              this.utilServ.resetDefaults();
              this.resetDefaults();
              this.fcmService.deleteToken();
              this.utilServ.setIntroStatus(1);
              localStorage.setItem('firstTime', 'true');
              localStorage.removeItem('userStatus');
              localStorage.setItem('lastLoginUser', JSON.stringify(lastLoginUser));
              localStorage.setItem('myMinors', JSON.stringify(myMinor));
              this.utilServ.navLogin();
              setTimeout(() => {
                window.location.reload();
              }, 300);
            });
          }
        }
      ]
    });
    await alert.present();
  }
  createScoutPaymentRecord(transId, timeStamp, userid, mode, status) {
    this.apiService.createScoutPaymentRecord(transId, timeStamp, userid, mode, status).subscribe((message: any) => {
      if (message) {
        // this.utilServ.getScoutStatusFrom();
        this.logout();
      }
    });
  }
  resetDefaults() {
    this.userDetail = null;
  }
}
