import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { Socket } from 'ngx-socket-io';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss'],
})
export class CreateGroupChatComponent implements OnInit {

  wallImage = '../../../assets/tribation.jpg';
  groupName = '';
  groupDec = '';
  imageGroup = '';
  imageGroupThumb = '';
  userDetail: any;
  selctedMembers: any;
  ids: any;
  data: any;

  // Strings
  typeDescriptionString = 'Type Description';
  groupNameString = 'Group Name';
  DescString = 'Description (Optional)';
  enterGroupNameString = 'Enter Group Name';
  createChatGroupString = 'Create Group Chat';
  selectedMembersString = 'Selected Members';
  groupCreatedString = 'Group Chat Created!';
  alreadyExistString = 'Group Already Exists';

  constructor(
    private modalController: ModalController,
    private actRouter: ActivatedRoute,
    private navParams: NavParams,
    private socket: Socket,
    private eventCustom: EventsCustomService,
    private apiService: ApiService,
    private nativeLib: DeviceNativeApiService,
    private utilServ: GenralUtilsService) {
    this.data = this.navParams.get('data');
    if (this.navParams.get('data')) {
      // console.log('You can Proceed', this.data);
    }
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.selctedMembers = this.data.details;
    this.ids = this.data.ids;

  }
  formatString(x) {
    this.groupName = this.utilServ.formatString(x);
  }
  presentActionSheet() {
    this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      this.wallImage = imgData.webPath;
      this.apiService.uploadTeamGroupCover(imgData.blob, this.userDetail.id).pipe().subscribe((data: any) => {
        if (data.success === 1) {
          this.imageGroup = data.message.original;
          this.imageGroupThumb = data.message.thumbnail;
          this.eventCustom.destroy('imageReady');
        } else {
          // console.log('can not get image data');
        }
      },
        (error: any) => {
          // console.log('Error' + '' + 'server Issue');
        });
    });
  }
  createGroupChat() {
    const x = this.ids;
    x.push(this.userDetail.id);
    this.apiService.connectFuntion();
    // console.log(
    //   ' this.userDetail.id: ', this.userDetail.id,
    //   ' x: ', x,
    //   ' this.groupName: ', this.groupName,
    //   ' this.groupDec: ', this.groupDec,
    //   ' this.imageGroup: ', this.imageGroup,
    //   ' this.imageGroupThumb: ', this.imageGroupThumb);
    this.apiService.createGroupChat(
      this.userDetail.id,
      x,
      this.groupName,
      this.groupDec,
      this.imageGroup,
      this.imageGroupThumb).subscribe((result: any) => {
        // console.log('REsult afetr adding', result);
        if (result.message !== 0) {
          const data = {
            members: x,
            user_id: this.userDetail.id,
            teamid: result.message.insertId,
            groupname: this.groupName
          };
          this.socket.emit('invite-groupchat-member', data);
          this.utilServ.presentToast(this.groupCreatedString);
          this.eventCustom.publish('sucessGroupChatCreation', true);
          this.back();
        } else {
          this.utilServ.presentToast(this.alreadyExistString);
          x.pop();
        }
      });
  }
  back() {
    this.modalController.dismiss({
      dismissed: true,
      data: null
    });
  }
  handlefileinputProfile(x) { }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.typeDescriptionString = this.utilServ.getLangByCode('type_description');
      this.groupNameString = this.utilServ.getLangByCode('group_name');
      this.enterGroupNameString = this.utilServ.getLangByCode('enter_group_name');
      this.createChatGroupString = this.utilServ.getLangByCode('createChatGroupString');
      this.DescString = this.utilServ.getLangByCode('description') + ' (' + this.utilServ.getLangByCode('optional') + ')';
      this.selectedMembersString = this.utilServ.getLangByCode('selectedMembersString');
      this.groupCreatedString = this.utilServ.getLangByCode('groupCreatedString');
      this.alreadyExistString = this.utilServ.getLangByCode('grp_name_exist');
    }
  }
}
