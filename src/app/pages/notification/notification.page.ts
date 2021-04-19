import { Component, OnInit, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Socket } from 'ngx-socket-io';
import { once } from 'process';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { BoldPipe } from '../../pipes/bold.pipe';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  @ViewChild('nutralize') nutralize: any;

  limitOfResults = 20;
  skipFirst = 0;
  userDetail: any;
  noNotification: any;
  notificationList: any = null;
  totalNotification: any;
  environment: any;
  limitReached = false;

  // String
  notifications = 'Notifications';
  noNotificationsString = 'No Notifications';
  clearAllNotifiString = 'Are you sure you want to delete all notifications?';
  cancelString = 'Cancel';
  okString = 'Ok';
  allNotifiDelString = 'All Notifications are deleted';
  // endOfSearchResultString = 'End of search results';
  deleteString = 'Delete';
  deleteSingleNotiString = 'Are you sure you want to delete this notification?';

  notifiTypeTeamCreate = 'team-create';
  notifiTypeTeamInvite = 'team-invite';
  notifiTypeFriendReq = 'friend-request';
  notifiTypeEventNotifi = 'event-notification';
  notifiTypeEventModify = 'event-notification-modify';
  notifiTypeEventDelete = 'event-notification-delete';
  notifiTypeFrndReqAccept = 'friend-request-accept';
  notifiTypeGrpChatInvite = 'groupchat-invite';
  notifiTypeMentionInPost = 'mention-notification';
  notifiTypeLikePost = 'like-notification';
  notifiTypeCommentPost = 'comment-notification';
  notifiTypeAcceptGrpReq = 'groupaccept';
  notifiTypeAcceptTeamReq = 'teamaccept';

  notifiTypeTeamInviteString = '%X invited you to join a team %Y.';
  notifiTypeFriendReqString = '%X requested to add you as a friend.';
  notifiTypeEventNotifiString = '%X created new event in team - %Y.';
  notifiTypeEventModifyString = '%X updated the event information - %Y.';
  notifiTypeEventDeleteString = '%X removed the event - %Y.';
  notifiTypeFrndReqAcceptString = '%X accepted your friend request.';
  notifiTypeGrpChatInviteString = '%X invited you to a new chat group %Y.';
  notifiTypeMentionInPostString = 'You got mentioned in a post';
  notifiTypeLikePostString = '%X liked your post';
  notifiTypeCommentPostString = '%X commented on your post';
  notifiTypeAcceptGrpReqString = '%X accepted your invite to join group chat %Y.';
  notifiTypeAcceptTeamReqString = '%X accepted your invite to join team %Y.';
  defaultString = '%X sent you something';

  constructor(
    private actRouter: ActivatedRoute,
    private apiService: ApiService,
    private alertController: AlertController,
    private router: Router,
    private element: ElementRef,
    private socket: Socket,
    // private sanitizer: Sanitizer,
    private eventCustom: EventsCustomService,
    private utilServ: GenralUtilsService,) {
    this.actRouter.queryParams.subscribe(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.limitOfResults = 20;
      this.skipFirst = 0;
      this.notificationList = null;
      this.getNotifications();

      this.apiService.updateLookedFlag(this.userDetail.id).subscribe((res: any) => {
        this.eventCustom.publish('badgeCount', res);
      });
      this.getLanguageStrings();
    });
    this.socket.on('accept-groupchat-join', (res) => {
      this.getNotifications();
      this.eventCustom.publish('badgeCount', res);
    });
    this.socket.on('accept-team-join', (res) => {
      this.getNotifications();
      this.eventCustom.publish('badgeCount', res);
    });
  }

  ngOnInit() {
    this.environment = environment;

  }
  ionViewWillEnter() {
    const inter = setInterval(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      if (this.userDetail) {
        this.getNotifications();
        clearInterval(inter);
      }
    }, 200);
  }
  async deleteAllNotifications() {
    const confirm = await this.alertController.create({
      header: this.deleteString + '?',
      message: this.clearAllNotifiString,
      buttons: [{
        text: this.cancelString,
        role: 'cancel'
      },
      {
        text: this.okString,
        handler: () => {
          this.apiService.clearAllNotification(this.userDetail.id).pipe().subscribe(async (res: any) => {
            if (res.success === 1) {
              this.notificationList.splice(0, this.notificationList.length);
              this.utilServ.okButtonMessageAlert(this.allNotifiDelString);
              this.checkNotificationsExist();
            }
          });
        }
      }
      ]
    });
    confirm.present();
  }
  async deleteNotification(itemId, n) {
    const confirm = await this.alertController.create({
      header: this.deleteString + '?',
      cssClass: 'buttonCss',
      message: this.deleteSingleNotiString,
      buttons: [{
        text: this.cancelString,
        role: 'cancel',
      },
      {
        text: this.okString,
        handler: () => {
          this.apiService.deleteNotification(itemId).pipe().subscribe((res: any) => {
            if (res.success === 1) {
              this.notificationList.splice(n, 1);
              this.checkNotificationsExist();
            }
          });
        }
      }
      ]
    });
    confirm.present();
  }
  getNotifications() {
    this.getLanguageStrings();
    this.apiService.getNotificationMore(this.userDetail.id, this.limitOfResults, this.skipFirst).subscribe((res: any) => {
      if (res.success === 1) {
        this.totalNotification = res.message.meta.total;
        if (this.notificationList) {
          const temp = res.message.content;
          temp.forEach(e => {
            const xd: any = this.getNotificationType(e.notification_type, e.from_id, e.eventname,
              e.first_name, e.last_name, e.groupname, e.teamname);
            e.notification_type = xd.displayText;
            e.route = xd.route;
            this.notificationList.push(e);
          });
        } else {
          this.notificationList = res.message.content;
          this.notificationList.forEach(e => {
            const xd: any = this.getNotificationType(e.notification_type, e.from_id,
              e.eventname, e.first_name, e.last_name, e.groupname, e.teamname);
            e.notification_type = xd.displayText;
            e.route = xd.route;
          });
          // console.log(res.message);
        }
        this.checkNotificationsExist();
      } else {
        this.checkNotificationsExist();
      }
    });
  }
  getTimeFromNow(dates) {
    return moment(dates).fromNow();
  }

  checkNotificationsExist() {
    setTimeout(() => {
      if (this.notificationList.length > 0) {
        this.noNotification = false;
      } else {
        this.noNotification = true;
      }
    }, 200);
  }
  loadMore(e) {
    if (this.notificationList) {
      if ((this.totalNotification === this.notificationList.length) || (this.totalNotification <= this.notificationList.length)) {
        this.limitReached = true;
      } else {
        this.skipFirst += 20;
        this.getNotifications();
      }
    }
    setTimeout(() => {
      e.target.complete();
    }, 500);
  }
  routeTo(x) {
    this.router.navigate([x]);
  }

  getNotificationType(notiType, fromId, eventName, firstName, lastName, grpName, teamName) {
    this.getLanguageStrings();
    switch (notiType) {
      case this.notifiTypeTeamCreate:
        {
          return {
            displayText: this.notifiTypeTeamInviteString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>')
              .replace('%Y', '<b>' + teamName + '</b>'),
            route: '/requests'
          };
        }
      case this.notifiTypeTeamInvite:
        {
          return {
            displayText: this.notifiTypeTeamInviteString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>')
              .replace('%Y', '<b>' + teamName + '</b>'),
            route: '/requests'
          };
        }
      case this.notifiTypeFriendReq:
        {
          return {
            displayText: this.notifiTypeFriendReqString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>'),
            route: '/requests'
          };
        }
      case this.notifiTypeEventNotifi:
        {
          return {
            displayText: this.notifiTypeEventNotifiString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>')
              .replace('%Y', '<b>' + teamName + '</b>'),
            route: '/events'
          };
        }
      case this.notifiTypeEventModify:
        {
          return {
            displayText: this.notifiTypeEventModifyString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>')
              .replace('%Y', '<b>' + eventName + '</b>'),
            route: '/events'
          };
        }
      case this.notifiTypeEventDelete:
        {
          return {
            displayText: this.notifiTypeEventDeleteString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>')
              .replace('%Y', '<b>' + eventName + '</b>'),
            route: '/events'
          };
        }
      case this.notifiTypeFrndReqAccept:
        {
          return {
            displayText: this.notifiTypeFrndReqAcceptString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>'),
            route: '/profile/' + fromId
          };
        }
      case this.notifiTypeGrpChatInvite:
        {
          return {
            displayText: this.notifiTypeGrpChatInviteString.replace('%X',
              '<b>' + firstName + ' ' + lastName + '</b>').replace('%Y', '<b>' + grpName + '</b>'),
            route: '/requests'
          };
        }
      case this.notifiTypeMentionInPost:
        {
          return {
            displayText: this.notifiTypeMentionInPostString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>'),
            route: '/timeline'
          };
        }
      case this.notifiTypeLikePost:
        {
          return {
            displayText: this.notifiTypeLikePostString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>'),
            route: '/profile/' + fromId
          };
        }
      case this.notifiTypeCommentPost:
        {

          return {

            displayText: this.notifiTypeCommentPostString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>'),
            route: '/profile/' + fromId
          };
        }
      case this.notifiTypeAcceptTeamReq:
        {
          return {
            displayText: this.notifiTypeAcceptTeamReqString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>')
              .replace('%Y', '<b>' + teamName + '</b>'),
            route: '/profile/' + fromId
          };
        }
      case this.notifiTypeAcceptGrpReq:
        {
          return {
            displayText: this.notifiTypeAcceptGrpReqString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>')
              .replace('%Y', '<b>' + grpName + '</b>'),
            route: '/profile/' + fromId
          };
        }
      default:
        return this.defaultString.replace('%X', '<b>' + firstName + ' ' + lastName + '</b>');
    }
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.notifications = this.utilServ.getLangByCode('notifications');
      this.noNotificationsString = this.utilServ.getLangByCode('no_notification');
      this.clearAllNotifiString = this.utilServ.getLangByCode('clear_all_notifications');
      this.allNotifiDelString = this.utilServ.getLangByCode('allNotifiDelString');
      // this.endOfSearchResultString = this.utilServ.getLangByCode('endOfSearchResultString');
      this.deleteSingleNotiString = this.utilServ.getLangByCode('notification.label.deleteSingleAlert');
      this.deleteString = this.utilServ.getLangByCode('delete');
      this.cancelString = this.utilServ.getLangByCode('cancel');
      this.okString = this.utilServ.getLangByCode('okay');

      this.notifiTypeTeamInviteString = this.utilServ.getLangByCode('notification.body.teamcreate');
      this.notifiTypeFriendReqString = this.utilServ.getLangByCode('notification.body.friendsrequest');
      this.notifiTypeEventNotifiString = this.utilServ.getLangByCode('notification.body.teamcreateevent');
      this.notifiTypeEventModifyString = this.utilServ.getLangByCode('notification.body.teamEventchange');
      this.notifiTypeEventDeleteString = this.utilServ.getLangByCode('notification.body.teamEventdelete');
      this.notifiTypeFrndReqAcceptString = this.utilServ.getLangByCode('notification.body.friendsrequestaccept');
      this.notifiTypeGrpChatInviteString = this.utilServ.getLangByCode('notification.body.groupchat.invite');
      this.notifiTypeMentionInPostString = this.utilServ.getLangByCode('notification.title.mentions');
      this.notifiTypeLikePostString = this.utilServ.getLangByCode('like_post_notification');
      this.notifiTypeCommentPostString = this.utilServ.getLangByCode('comment_notification');
      this.notifiTypeAcceptGrpReqString = this.utilServ.getLangByCode('notification.body.groupaccept');
      this.notifiTypeAcceptTeamReqString = this.utilServ.getLangByCode('notification.body.teamaccept');
      this.defaultString = this.utilServ.getLangByCode('notification.body.default');
    }
  }
}
