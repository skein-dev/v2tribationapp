import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsCustomService } from './events-custom.service';

import { Capacitor, Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/core';
const { LocalNotifications, PushNotifications } = Plugins;
import { FCM } from '@capacitor-community/fcm';
import { GenralUtilsService } from './genral-utils.service';
import { Badge } from '@ionic-native/badge/ngx';

const fcm = new FCM();
const { FCMPlugin } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class FcmServiceService {
  permissionFCM = false;
  constructor(
    private eventCustom: EventsCustomService,
    private platform: Platform,
    private utilServ: GenralUtilsService,
    private actRouter: ActivatedRoute,
    private badge: Badge, 
    private router: Router) {
    this.actRouter.queryParams.subscribe(() => {
      if (Capacitor.platform !== 'web') {

       PushNotifications.getDeliveredNotifications().then(result => {
        PushNotifications.removeAllDeliveredNotifications();
        this.badge.clear();
        if (result.notifications.length > 0) {
          PushNotifications.removeAllDeliveredNotifications();
          this.badge.clear();
        } 
       });
      //  this.badge.requestPermission().then(result => {
      //   this.badge.increase(1);
      //  })

        PushNotifications.requestPermission().then(result => {
          if (result.granted) {
            this.permissionFCM = true;
            this.registerPush();
          } else {
            this.permissionFCM = false;
          }
          // console.log('Permission Firbase ==> ', JSON.stringify(result.granted));
        });
        this.registerPush();
      }
    });
  }
  readNotification(){
    PushNotifications.getDeliveredNotifications().then(result => {
      PushNotifications.removeAllDeliveredNotifications();
      this.badge.clear();
      if (result.notifications.length > 0) {
        PushNotifications.removeAllDeliveredNotifications();
        this.badge.clear();
      } 
     });
  }
registerPushNativeReassign(){
  if (Capacitor.platform !== 'web') {
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        this.permissionFCM = true;
        this.registerPush();
      } else {
        this.permissionFCM = false;
        
      }
      // console.log('Permission Firbase ==> ', JSON.stringify(result.granted));
    });
    this.registerPush();
  }
}
getStatus(){
  // console.log('inside FCM');
  if (Capacitor.platform !== 'web') {
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        this.permissionFCM = true;
        this.registerPush();
      } else {
        this.permissionFCM = false;
      }
      // console.log('Permission Firbase ==> ', JSON.stringify(result.granted));
    });
    return this.permissionFCM;
  }
}
  newToken() {
    if (Capacitor.platform !== 'web') {
      // register for push
      PushNotifications.register();
      // .then(() => {
      //   if (this.permissionFCM === true) {
      //     FCMPlugin.subscribeTo({ topic: 'message' }).then((r: any) => {
      //       console.log('Message FromId:::', JSON.stringify(r));
      //     });
      //     FCMPlugin.subscribeTo({ topic: 'timeline' }).then((r: any) => {
      //       console.log('timeline FromId:::', JSON.stringify(r));
      //     });
      //     FCMPlugin.subscribeTo({ topic: 'requests' }).then((r: any) => {
      //       console.log('requests FromId:::', JSON.stringify(r));
      //     });
      //     FCMPlugin.subscribeTo({ topic: 'user' }).then((r: any) => {
      //       console.log('user FromId:::', JSON.stringify(r));
      //     });
      //     FCMPlugin.subscribeTo({ topic: 'friends' }).then((r: any) => {
      //       console.log('friends FromId:::', JSON.stringify(r));
      //     });
      //     FCMPlugin.subscribeTo({ topic: 'groupmessage' }).then((r: any) => {
      //       console.log('groupmessage FromId:::', JSON.stringify(r));
      //     });
      //     FCMPlugin.subscribeTo({ topic: 'team' }).then((r: any) => {
      //       console.log('team FromId:::', JSON.stringify(r));
      //     });
      //     FCMPlugin.subscribeTo({ topic: 'event' }).then((r: any) => {
      //       console.log('event FromId:::', JSON.stringify(r));
      //     });
      //   }
      // }).catch((err) => {
      //   console.log('Error Fcm Register', JSON.stringify(err));
      // });

      // Get FCM token instead the APN one returned by Capacitor
      fcm
        .getToken()
        .then((r) => {
          // console.log(`Token ${r.token}`);
          this.eventCustom.publish('newDeviceTocken', r.token);
          this.registerPush();
          // return r.token;
        })
        .catch((err) => {
          console.log('fcm token error');
          console.log('ErrorGetTocken', JSON.stringify(err));
        });
    }
  }
  deleteToken() {
    // if (Capacitor.platform !== 'web') {
    //   console.log('deleting Tocken');
    //   fcm.deleteInstance();
    // }
  }
  registerPush() {
    // this.firestore;
    if (Capacitor.platform !== 'web') {
      PushNotifications.addListener(
        'registration',
        (token: PushNotificationToken) => {
          // console.log('My token: ' + JSON.stringify(token.value));
          // alert('My token: ' + JSON.stringify(token.value));
          // this.eventCustom.publish('newDeviceTocken', token.value);
        }
      );

      PushNotifications.addListener('registrationError', (error: any) => {
        // console.log('Error: ' + JSON.stringify(error));
        // alert('Error: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotification) => {
          setTimeout(() => {
            localStorage.setItem('dataNOti', JSON.stringify(notification));
          }, 550);
        }
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        async (notification: PushNotificationActionPerformed) => {
          const notiDataRes = notification.notification.data;
          this.routeTo(notiDataRes);
          setTimeout(() => {
            localStorage.setItem('notification', JSON.stringify(notiDataRes));
            // console.log('Push action performed: ' + JSON.stringify(notification.notification));
            // alert('Push action performed: ' + JSON.stringify(notification.notification));
          }, 550);
        });
    }
  }
  routeTo(notiData) {
    // console.log('notiData Route ', JSON.stringify(notiData));
    if (notiData.type) {
      
      const notificationType = notiData.type;
      setTimeout(() => {
        switch (notificationType) {
          case 'message': {
            this.utilServ.navChatwithId(notiData.fromid);
            break;
          }
          case 'timeline': {
            localStorage.setItem('notificationTimeline', JSON.stringify(notiData));
            break;
          }
          case 'requests': {
            this.router.navigate(['/requests']);
            break;
          }
          case 'user': {
            this.router.navigate([`profile/${notiData.fromid}`]);
            break;
          }
          case 'friends': {
            this.router.navigate([`profile/${notiData.fromid}`]);
            break;
          }
          case 'groupmessage': {
            this.utilServ.navGroupChatwithId(notiData.groupid);
            break;
          }
          case 'team': {
            this.utilServ.navGroupChatwithId(notiData.groupid);
            break;
          }
          case 'event': {
            this.router.navigate(['/events']);
            break;
          }
          default: {
            this.router.navigate(['/']);
            localStorage.setItem('unkonktype', JSON.stringify(notificationType));
            break;
          }
        }
      }, 900);
    } else {
      // console.log('No notiData.type');
    }
  }
}
