import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import {
  Plugins, CameraResultType, Capacitor, FilesystemDirectory,
  CameraPhoto, CameraSource, PromptResult
} from '@capacitor/core';
import { EventsCustomService } from './events-custom.service';
import { ApiService } from './api.service';
import { GenralUtilsService } from './genral-utils.service';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file/ngx';

const { Camera, Filesystem, Storage } = Plugins;


interface Photo {
  filepath: string;
  webviewPath: string;
  base64?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceNativeApiService {

  // public photos: Photo[] = [];
  public blobURL: any; // Image
  public blob: any;    // Blob

  albumsString = 'Albums';
  cameraString = 'Camera';
  galleryString = 'Gallery';

  imageURL;
  userDetail;
  tempTest: any;
  sanitizer: any;

  imageExtArray = ['image/gif', 'image/png', 'image/heic'];
  vidExtArray = ['video/webm', 'video/mpg', 'video/mp4', 'video/avi', 'video/mov', 'mp4', 'mov', 'video/3gpp', 'webm', 'video/quicktime', 'qt'];


  constructor(
    private actionSheetController: ActionSheetController,
    private platform: Platform,
    private apiService: ApiService,
    private utilServ: GenralUtilsService,
    private eventCustom: EventsCustomService,
    private androidPermissions: AndroidPermissions,
    public alertController: AlertController,
    private mediaCapture: MediaCapture,
    private file: File) {
    this.getPermissions();
    this.platform = platform;
    this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
    if (this.utilServ.langSetupFLag) {
      this.galleryString = this.utilServ.getLangByCode('gallery');
      this.cameraString = this.utilServ.getLangByCode('camera');
      this.albumsString = this.utilServ.getLangByCode('albums');
      // this.takePictureString = this.utilServ.getLangByCode('take_photo');
      // this.takeVideoString = this.utilServ.getLangByCode('take_video');
    }
  }
  getPermissions() {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.READ_PHONE_STATE,
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      ]
    );
  }
  // Take a photo
  async takePicture(CameraSource) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource,
      quality: 70
    });
    const x = { webPath: capturedPhoto.webPath, blob: null, reqPath: null };
    const blb = await fetch(capturedPhoto.webPath).then(r => r.blob());
    x.blob = blb;
    x.reqPath = capturedPhoto.path;
    const inter = setInterval(() => {
      if (x.blob !== null) {
        clearInterval(inter);
        this.eventCustom.publish('imageReady', x);
      }
    }, 200);
    // return capturedPhoto.webPath;
  }

  async presentActionSheetCamOrGall() {
    const actionSheet = await this.actionSheetController.create({
      header: this.albumsString,
      buttons: [{
        text: this.cameraString,
        icon: 'camera',
        handler: () => {
          this.takePicture(CameraSource.Camera);
        }
      }, {
        text: this.galleryString,
        icon: 'image',
        handler: () => {
          this.takePicture(CameraSource.Photos);
        }
      }]
    });
    await actionSheet.present();
  }

  // Timeline - upload post
  async captureImage(CameraSource) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource,
      quality: 60,
    });
    let x = { mediaUrl: capturedPhoto.webPath, blob: null, filename: null, type: null };
    const newFileName = this.utilServ.getTimeStamp() + (capturedPhoto.path).split('/', -1).pop();
    x.filename = newFileName;
    const blb = await fetch(capturedPhoto.webPath).then(r => r.blob());
    x.blob = blb;
    x.type = blb.type;
    this.eventCustom.publish('imageReady', x);
  }
  async captureVideo() {
    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30,
      quality: 0
    };
    let capturedVideo = await this.mediaCapture.captureVideo(options);
    const webPathVideo = Capacitor.convertFileSrc(capturedVideo[0].fullPath);
    const response = await fetch(webPathVideo);
    const blb = await response.blob();
    const newFileName = this.utilServ.getTimeStamp() + capturedVideo[0].name;
    const x = {
      mediaUrl: webPathVideo,
      blob: blb,
      filename: newFileName,
      type: capturedVideo[0].type
    };
    this.eventCustom.publish('videoReady', x);
  }
  async captureVideoForIos() {
    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 30,
      quality: 1
    };
    let capturedVideo = await this.mediaCapture.captureVideo(options);
    if (capturedVideo[0].fullPath){
      this.file.resolveLocalFilesystemUrl("file://" + capturedVideo[0].fullPath).then((entry: FileEntry) => {
        entry.file(file => {
          let reader = this.getReader();
          reader.onloadend = () => {
            const blb = new Blob([reader.result], {
              type: file.type
            });
            this.eventCustom.publish('videoReady', blb);
          };
          reader.readAsArrayBuffer(file);
        });
      });
    }
  }
  getReader() {
    const reader = new FileReader();
    const zoneOriginalInstance = (reader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || reader;
  }
}

