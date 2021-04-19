import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ScoutSubscribtionInfoComponent } from 'src/app/components/scout-subscribtion-info/scout-subscribtion-info.component';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-doc-to-upload',
  templateUrl: './doc-to-upload.page.html',
  styleUrls: ['./doc-to-upload.page.scss'],
})
export class DocToUploadPage implements OnInit {
  @ViewChild('userInput') userInputViewChild: ElementRef;
  fName;
  userInputElement: HTMLInputElement;
  lName;
  userDetail;
  diasbleContinue = true;
  disabledoc1 = false;
  disabledoc2 = false;
  pending = false;
  contactUS = false;
  pendingAprovalString = 'Wating for approval';
  contactUs4Approval = 'Contact Tribation for Approval';
  becomeAScoutString = 'Become A Scout';
  firstNameString = 'First Name';
  lastNameString = 'Last Name';
  continueString = 'Continue';
  scoutintro1;
  scoutintro2;
  scoutStatus;
  commingSoonString = 'Feature comming with the next release!';
  limitFileSelectionString = 'You can select only 2 Files';
  fileImage = '../../../../assets/iconsSvg/cloud-upload.svg';
  uploadedFile = '../../../../assets/iconsSvg/documnet.svg';
  docToUploadString = 'Candidates for Scouts must provide 2 Government issued photo identification form their country of origin.';
  documentOne = 'Upload supporting doccument';
  documentTwo = 'Upload additional supporting document';
  uplodDocSucessString = 'Document has been uploded sucessfully';
  docsToUpld = [{ image: this.fileImage, filename: this.documentOne }, { image: this.fileImage, filename: this.documentTwo }];
  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private socket: Socket,
    private apiService: ApiService,
    private utilServ: GenralUtilsService) {
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.actRouter.queryParams.subscribe(() => {
      this.utilServ.getScoutStatusFrom();
      this.apiService.getScoutFilePaymentStatus(this.userDetail.id).subscribe((res: any) => {
        if (res.message.fileCount === 2 && res.message.paymentDetails === this.userDetail.id) {
          this.apiService.getScoutPaymentStatus(this.userDetail.id).subscribe((res: any) => {
            if (res.message.status === 1 && res.message.mode !== null) {
              this.utilServ.setScoutStatus(true);
              this.router.navigate(['/scouts']);
            }
          });
        }
      });
      const zy = setInterval(() => {
        // debugger;
        this.scoutStatus = this.utilServ.getScoutStatus();
        if (this.scoutStatus === true || this.scoutStatus === false) {
          clearInterval(zy);
          if (this.scoutStatus === true) {
            this.router.navigate(['/scouts']);
          } else {
            // console.log('this is false');
          }
        }
      }, 5);

      this.getLanguageStrings();
      this.countCheck();
    });

    this.socket.on('scout-update-document-status', (data) => {

      /*0 pending, 
      1 approved & payment pending, 
      2 approved & payment received, 
      3 contact us to proceed, 
      8 rejected, resubmit allowed, 
      9 rejected, no resubmit allowed*/

      if (data.status) {
        const x = data.status;
        // console.log(x);
        this.switcher(x);
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.userInputElement = this.userInputViewChild.nativeElement;
  }
  countCheck() {
    this.apiService.getScoutFilePaymentStatus(this.userDetail.id).subscribe((data: any) => {
      console.log('Scout data', data);
      // console.log('Scout data', data);
      if (data.message.fileCount !== null) {
        const a = data.message.fileCount;
        // console.log('ldgkfhkjhsgjkh', a);
        if (a === 1) {
          this.disabledoc1 = true;
          this.diasbleContinue = true;
          // console.log('1');
        } else if (a === 2) {
          this.disabledoc2 = true;
          this.disabledoc1 = true;
          this.diasbleContinue = false;
          // this.pending = true;
          // console.log('2');
        } else if (data.message.fileCount === 0) {
          this.pending = false;
          this.disabledoc2 = false;
          this.disabledoc1 = false;
          this.diasbleContinue = true;
        }
      }
    });
    // this.apiService.scoutStatusPayDoc(this.userDetail.id).subscribe((res: any) => {
    //   this.switcher(res.message.status);
    // });
  }

  switcher(x) {
    switch (x) {
      case 0: {
        this.diasbleContinue = true;
        this.disabledoc1 = true;
        this.disabledoc2 = true;
        this.pending = true;
        break;
      }
      case 2: {
        this.utilServ.setScoutStatus(true);
        this.router.navigate(['/scouts']);
        break;
      }
      case 1: {
        this.diasbleContinue = false;
        this.disabledoc2 = true;
        this.disabledoc1 = true;
        this.pending = false;
        this.contactUS = false;
        break;
      }
      case 3: {
        this.disabledoc1 = true;
        this.disabledoc2 = true;
        this.diasbleContinue = true;
        this.contactUS = true;
        break;
      }
      case 8: {
        this.diasbleContinue = true;
        this.disabledoc1 = false;
        this.disabledoc2 = false;
        this.pending = false;
        this.contactUS = false;
        break;
      }
      case 9: {
        this.diasbleContinue = true;
        this.disabledoc1 = true;
        this.disabledoc2 = true;
        this.pending = false;
        this.contactUS = true;
        break;
      }
      default: {
        this.disabledoc1 = false;
        this.disabledoc2 = false;
        this.diasbleContinue = true;
        this.pending = false;
        this.contactUS = false;
        break;
      }
    }
  }

  back() {
    this.modalController.dismiss();
  }

  uploadScoutDocs() {
    this.userInputElement.click();
    // this.countCheck();
    // this.utilServ.presentToast(this.commingSoonString);
  }

  handlefileinputIdCard(event) {
    if (event.target.files && event.target.files[0]) {
      const myFile = event.target.files;
      if (myFile.length > 2) {
        this.utilServ.presentToast(this.limitFileSelectionString);
        return;
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < myFile.length; i++) {
        this.apiService.uploadScoutDocument(myFile[i], this.userDetail.id).subscribe((data: any) => {
          // console.log(data);
          this.docsToUpld.pop();
          this.docsToUpld.unshift({ image: this.uploadedFile, filename: data.message.uploadResult.name });
          if (data.success === 1) {
            this.countCheck();
            this.utilServ.presentToast(this.uplodDocSucessString);
          }
        });
      }
    }
  }
  continuePay() {
    this.router.navigate(['scouts/subscribing-plan']);
  }


  async getScoutSubsInfo() {
    const modal = await this.modalController.create({
      component: ScoutSubscribtionInfoComponent,
      cssClass: 'scoutInfoSubs',
    });
    modal.onDidDismiss().then((sectionRes) => {
    });

    return await modal.present();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.firstNameString = this.utilServ.getLangByCode('first_name');
      this.lastNameString = this.utilServ.getLangByCode('last_name');
      this.scoutintro1 = this.utilServ.getLangByCode('scoutintro1');
      this.scoutintro2 = this.utilServ.getLangByCode('scoutintro2');
      this.docToUploadString = this.utilServ.getLangByCode('scout.label.instruction.1');
      this.becomeAScoutString = this.utilServ.getLangByCode('becomeAScoutString');
      this.continueString = this.utilServ.getLangByCode('common.label.continue');
      this.commingSoonString = this.utilServ.getLangByCode('scout.label.commingSoon');
      this.uplodDocSucessString = this.utilServ.getLangByCode('scout.label.uplodDocSucess');
      this.documentOne = this.utilServ.getLangByCode('scout.label.uploadDocument.1');
      this.documentTwo = this.utilServ.getLangByCode('scout.label.uploadDocument.2');
      this.pendingAprovalString = this.utilServ.getLangByCode('scouts.status.waitingApproval');
      this.contactUs4Approval = this.utilServ.getLangByCode('scouts.status.contactUs');
    }
  }
}
