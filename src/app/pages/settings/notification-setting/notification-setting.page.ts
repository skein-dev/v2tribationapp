import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FcmServiceService } from 'src/app/services/fcm-service.service';
import { EventsCustomService } from 'src/app/services/events-custom.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.page.html',
  styleUrls: ['./notification-setting.page.scss'],
})
export class NotificationSettingPage implements OnInit {
  userDetail;
  nativeNoti;
  friendRequestNoti = false;
  friendAcceptNoti = false;
  likeNoti = false;
  commentNoti = false;
  mentionNoti = false;
  teamCreateNoti = false;
  eventCreatNoti = false;
  eventDeleteNoti = false;
  eventUpdateNoti = false;
  messageNoti = false;
  groupAcceptNoti = false;
  groupInviteNoti = false;
  scoutAcceptNoti = false;
  fcmStatus = false;

  // Strings
  notificationSettingsString = 'Notification Settings';
  friendRequestNotiString = 'Friend request';
  friendAcceptNotiString = 'Friend request accepted';
  likeNotiString = 'Likes';
  commentNotiString = 'Comments';
  mentionNotiString = '@ Mentions';
  teamCreateNotiString = 'Team created';
  eventCreatNotiString = 'Event created';
  eventDeleteNotiString = 'Event deleted';
  eventUpdateNotiString = 'Event updated';
  messageNotiString = 'Messages';
  groupAcceptNotiString = 'Group accept';
  groupInviteNotiString = 'Group Invite';
  scoutAcceptNotiString = 'Scout Accept';
  notificationSettingsArray: any;

  constructor(
    private location: Location,
    private actRouter: ActivatedRoute,
    private fcmService: FcmServiceService,
    private apiService: ApiService,
    private eventCustom: EventsCustomService,
    private utilServ: GenralUtilsService,) {
    this.actRouter.queryParams.subscribe(() => {
      this.fcmStatus = this.fcmService.getStatus();
      this.nativeNoti = this.fcmStatus;
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.setUpBasicDetails();
  }
  ionViewWillEnter() {
    this.utilServ.checkUserExists();
    this.setUpBasicDetails();
  }
  // registerPushNative() {
  //   // if (this.fcmStatus === false) {
  //     this.fcmService.newToken();
  //     this.eventCustom.subscribe('newDeviceTocken', (token: any) => {
  //       localStorage.setItem('devicetoken', JSON.stringify(token));
  //       this.fcmService.registerPushNativeReassign();
  //       this.fcmService.registerPush();
  //       this.apiService.registerToken(token, this.userDetail.email).subscribe((res: any) => {
  //       this.fcmService.registerPush();
  //       console.log(res);
  //       });

  //     });
  //   // } else{
  //   //   this.fcmService.registerPush();
  //   //   console.log('its all done');
  //   // }
  // }
  setUpBasicDetails() {
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    if (this.utilServ.langLibrary) {
      this.getCurrentSetting();
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      if (this.utilServ.langSetupFLag) {
        this.notificationSettingsString = this.utilServ.getLangByCode('notification_settings');
        this.friendRequestNotiString = this.utilServ.getLangByCode('friend_req_notification');
        this.friendAcceptNotiString = this.utilServ.getLangByCode('friend_accpet_notification');
        this.likeNotiString = this.utilServ.getLangByCode('like_notification');
        this.commentNotiString = this.utilServ.getLangByCode('comment_notification_setting');
        this.mentionNotiString = this.utilServ.getLangByCode('at_mention_notification');
        this.teamCreateNotiString = this.utilServ.getLangByCode('team_create_notification_setting');
        this.eventCreatNotiString = this.utilServ.getLangByCode('event_create_notification_setting');
        this.eventDeleteNotiString = this.utilServ.getLangByCode('delete_event_notification_setting');
        this.eventUpdateNotiString = this.utilServ.getLangByCode('update_event_notification_setting');
        this.messageNotiString = this.utilServ.getLangByCode('message_notification_setting');
        this.groupAcceptNotiString = this.utilServ.getLangByCode('');
        this.groupInviteNotiString = this.utilServ.getLangByCode('group_invite_request');
        this.scoutAcceptNotiString = this.utilServ.getLangByCode('scout_accept_notification_setting');

      } else {
        this.utilServ.checkBasicElseRelodApp();
      }
    } else {
      window.location.reload();
    }
  }
  getCurrentSetting() {
    this.apiService.notification_setting_list(this.userDetail.id).pipe().subscribe((res: any) => {
      if (res.success === 1) {
        this.notificationSettingsArray = res.message[0];
        this.friendRequestNoti = Boolean(this.notificationSettingsArray.friend_request);
        this.friendAcceptNoti = Boolean(this.notificationSettingsArray.friend_accept);
        this.likeNoti = Boolean(this.notificationSettingsArray.likenotify);
        this.commentNoti = Boolean(this.notificationSettingsArray.comment);
        this.mentionNoti = Boolean(this.notificationSettingsArray.mention);
        this.teamCreateNoti = Boolean(this.notificationSettingsArray.team_create);
        this.eventCreatNoti = Boolean(this.notificationSettingsArray.event_create);
        this.eventDeleteNoti = Boolean(this.notificationSettingsArray.event_delete);
        this.eventUpdateNoti = Boolean(this.notificationSettingsArray.event_update);
        this.messageNoti = Boolean(this.notificationSettingsArray.message);

        this.groupAcceptNoti = Boolean(this.notificationSettingsArray.groupaccept);
        this.groupInviteNoti = Boolean(this.notificationSettingsArray.groupinvite);
        this.scoutAcceptNoti = Boolean(this.notificationSettingsArray.scout_accept);
      }
    });
  }

  notiSettingChange(value, target) {
    const valToSend = Number(value);
    this.apiService.notificationSettingChange(this.userDetail.id, target, valToSend).subscribe((res: any) => {
      console.log(res);
    });
  }

  back() {
    this.location.back();
  }
}
