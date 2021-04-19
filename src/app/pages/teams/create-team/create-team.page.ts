import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { AddTeamMemberComponent } from 'src/app/components/add-team-member/add-team-member.component';
import { ModalController } from '@ionic/angular';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { ApiService } from '../../../services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';


const trimValidator: ValidatorFn = (control: FormControl) => {
  if (control.value) {
    if (control.value.startsWith(' ')) {
      return {
        'trimError': { value: 'control has leading whitespace' }
      };
    }
  }
  return null;
};
@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.page.html',
  styleUrls: ['./create-team.page.scss'],
})
export class CreateTeamPage implements OnInit {
  createTeam: FormGroup;

  environment;
  imageprofile;
  teamData;
  teamPic = '';
  userDetail;


  // Strings
  typeTeamDescString = 'Type your team description (Optional)';
  typeTeamNameString = 'Type your Team Name';
  nextString = 'Next';
  mustEnterTeamnameString = 'Must Enter Team Name';
  noSpaceString = 'No space';

  constructor(
    private nativeLib: DeviceNativeApiService,
    private eventCustom: EventsCustomService,
    private modalController: ModalController,
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private location: Location,
    private utilServ: GenralUtilsService) {
    this.environment = environment;
    this.imageprofile = `${environment.apiUrl}v1/api/post/imagecall_mobile_url?imagepath=profile/cover1.jpg`;
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
    this.createform();
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
  }

  private createform() {
    this.createTeam = new FormGroup({
      teamName: new FormControl('', Validators.compose([Validators.required, trimValidator])),
      teamDescription: new FormControl('', []),
    });
  }

  ionViewWillLeave() {
    this.createTeam.reset();
  }

  async addMembers() {
    this.teamData = {
      teamName: this.createTeam.value.teamName,
      teamDesc: this.createTeam.value.teamDescription,
      teamPicUrl: this.teamPic
    };
    localStorage.setItem('teamData', JSON.stringify(this.teamData));
    const modal = await this.modalController.create({
      component: AddTeamMemberComponent,
      componentProps: {
        custom_data: null
      }
    });
    modal.onDidDismiss().then((code) => {
      this.back();
    });
    return await modal.present();
  }
  presentActionSheet() {
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      this.imageprofile = imgData.webPath;
      // console.log("imagedata", imgData.blob, "id", this.userDetail.id)
      this.apiService.uploadTeamGroupCover(imgData.blob, this.userDetail.id).subscribe((data: any) => {
        if (data.success === 1) {
          this.teamPic = data.message;
          this.eventCustom.destroy('imageReady');
        } else { console.log('can not get image data'); }
      },
        (error: any) => {
          console.log('Error' + '' + 'server Issue');
        });
    });
  }

  back() {
    this.location.back();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.typeTeamNameString = this.utilServ.getLangByCode('enter_team_name');
      this.typeTeamDescString = this.utilServ.getLangByCode('type_your_team_description');
      this.nextString = this.utilServ.getLangByCode('next');
      this.mustEnterTeamnameString = this.utilServ.getLangByCode('must_enter_teamname');
      this.noSpaceString = this.utilServ.getLangByCode('no_space');
    }
  }
}
