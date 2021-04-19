import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ActionSheetController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DeviceNativeApiService } from 'src/app/services/device-native-api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { CameraSource, Capacitor } from '@capacitor/core';
import { EventsCustomService } from 'src/app/services/events-custom.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { File, DirectoryEntry, FileEntry } from '@ionic-native/file/ngx';



@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  @ViewChild('postText') postText: any;
  @ViewChild('userInput') userInputViewChild: ElementRef;
  @ViewChild('userInputForIos') userInputViewChildForIos: ElementRef;


  environment;
  userDetail;
  postData;
  legacySportIcon = '';
  postUser;
  postContent;
  originalPostContent;
  showMensionPickUp = false;
  friendsList: any;
  atCount: any;
  currentSerachTag;
  currentSearchArray: string[];
  searchFriendsList: any;
  tempFriendTag: any;
  tempReplacement: any[] = [];
  tempPostContent: string;
  userInputElement: HTMLInputElement;
  userInputElementForIos: HTMLInputElement;
  ifEditied = false;
  mediaArray = [];
  progressBarval = 0;
  showProgressFlag = false;
  showPostButton = false;
  showLoadingImage = false;
  showCloseBtn = true;
  postReadonly = false;
  selectedMediaLoader = [];
  tempVar;
  videoProcesComplete = true;

  imageExtArray = ['image/gif', 'image/jpeg', 'image/png', 'image/heic'];
  vidExtArray = ['video/webm', 'video/mpg', 'video/mp4', 'video/avi', 'video/mov', 'mp4', 'mov', 'video/3gpp', 'webm', 'video/quicktime', 'qt', 'MPEG-4', 'MPEG', 'HEIF', 'HEVC'];
  fileSizeLargeString = 'File too large';


  // String
  editPostString = 'Edit Post';
  saveString = 'Save';
  mediaTypeNotFoundString = 'Media type is not supported';
  imageString = 'Attach Image';
  videoString = 'Attach Video';
  uploadMedialErrorString = 'Unable to upload. Please try again';
  takePictureString = 'Take Picture';
  takeVideoString = 'Take Video';
  galleryString = 'Gallery';
  captureImageString = 'Capture Image';
  captureVideoString = 'Record Video';
  pickImageString = 'Select Image';
  pickVideoString = 'Select Video';

  constructor(
    private camera: Camera,
    private platform: Platform,
    private apiService: ApiService,
    private router: Router,
    private videoEditor: VideoEditor,
    private element: ElementRef,
    private nativeLib: DeviceNativeApiService,
    private utilServ: GenralUtilsService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private actRouter: ActivatedRoute,
    private eventCustom: EventsCustomService,
    private file: File) {
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.friendsList = this.utilServ.friendsList;
    this.searchFriendsList = this.friendsList;
    this.postData = JSON.parse(localStorage.getItem('postDataEdit'));
    this.postUser = this.postData.user;
    // const x = setInterval(() => {
    //   if (this.xDx.length > 0) {
    //     this.ifEditied = true;
    //     clearInterval(x);
    //   }
    // }, 200);
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
    this.environment = environment;
    // console.log(this.postData);
    this.postContent = this.postData.content;
    this.originalPostContent = this.postContent;
    this.mediaArray = this.postData.assets;

    this.makeItViewable();


  }
  ngAfterViewInit() {
    this.userInputElement = this.userInputViewChild.nativeElement;
    this.userInputElementForIos = this.userInputViewChildForIos.nativeElement;

  }
  makeItViewable() {
    const tempPostContent: string = this.postContent;
    const aTimes = this.occurrences(tempPostContent, '<a href=', false);
    const aCloseTimes = this.occurrences(tempPostContent, '</a>', false);
    const xOpen: string[] = tempPostContent.split(' <a href');
    let poople: any[] = [];
    let poopleName: any[] = [];
    let zOpen = '';
    let zClose = '';
    for (let i = 0; i <= aTimes; i++) {
      zOpen += xOpen[i].replace('class=\'make_a_tag\'> ', '');
    }

    const totalProple = this.occurrences(zOpen, '=\'', false);
    let finalString = '';
    let startWith = '';
    let endWith = '';
    const idContent: string[] = zOpen.split(' =');
    // tslint:disable-next-line: prefer-const
    let temp: any[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < idContent.length; i++) {
      temp.push(idContent[i].split('\''));
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < temp.length; i++) {
      const zx: string[] = temp[i];
      if (zx[0]) {
        finalString += zx[0];
      }
      if (zx[1]) {
        poople.push(zx[1]);
        // console.log(JSON.stringify(zx[2]), zx[2].indexOf('</a>'));
        startWith = zx[2].substr(1, (zx[2].indexOf('</a>') - 2));
        poopleName.push(startWith);
        let tempPush = {
          id: zx[1],
          name: startWith,
          replaced: ''
        };
        const till = this.occurrences(startWith, ' ', false);
        for (let xdf = 0; xdf < till; xdf++) {
          startWith = startWith.replace(' ', '_');
        }
        tempPush.replaced = startWith.toUpperCase();
        this.tempReplacement.push(tempPush);
        startWith = '@' + startWith.toUpperCase();
        endWith = zx[2].substr((zx[2].indexOf('</a>') + 4), zx[2].length);
        finalString += ' ' + startWith + endWith;
      }
    }
    if (finalString.indexOf('=') === 0) {
      finalString = finalString.substring(1, finalString.length);
    }
    this.postContent = finalString;

    setTimeout(() => {
      this.moveFocus(this.postText);
    }, 800);
  }

  postContentEdit(x: string) {
    if (this.postContent !== this.originalPostContent) {
      this.ifEditied = true;
    } else {
      this.ifEditied = false;
    }
    if (this.showMensionPickUp === false) {
      this.atCount = x.length;
    }
    this.currentSearchArray = x.split('@');
    this.currentSerachTag = this.currentSearchArray[this.currentSearchArray.length - 1];
    if (this.currentSearchArray.length > 1 && this.showMensionPickUp === true) {
      // console.log('curentsearch', this.currentSerachTag.length, ' : ', this.currentSerachTag);
    }

    if (this.showMensionPickUp === true) {
      this.search(this.currentSerachTag);
    }

    this.postContent = this.utilServ.formatString(this.postContent);
  }

  onFriendTag(x) {
    this.tempFriendTag = { id: x.id, name: x.name };
    const t = this.occurrences(this.tempFriendTag.name, ' ', false);
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < t; index++) {
      this.tempFriendTag.name = this.tempFriendTag.name.replace(' ', '_');
      // const element = array[index];
    }
    this.tempFriendTag.name = this.tempFriendTag.name.toUpperCase();
    const ttmp = {
      replaced: this.tempFriendTag.name,
      name: x.name,
      id: this.tempFriendTag.id,
    };
    this.postContent = this.postContent.substr(0, this.atCount) + '' + this.tempFriendTag.name + ' ';
    this.tempReplacement.push(ttmp);
    this.showMensionPickUp = false;
    this.moveFocus(this.postText);
    this.searchFriendsList = this.friendsList;
  }
  search(x) {
    this.searchFriendsList = this.filter(this.friendsList, x || null);
  }
  filter(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(terms);
    });
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
  private dontReloadMension(): void {
    setTimeout(() => {
      const urls: any = this.element.nativeElement.querySelectorAll('a');
      urls.forEach((url) => {
        url.addEventListener('click', (event) => {
          event.preventDefault();
          const textOfLink = event.target.innerText;
          // console.log(textOfLink);
          const x = event.target.href.split(/[\s/]+/);
          this.router.navigate([`profile/${x[x.length - 1]}`]);
        }, false);

      });
    }, 1500);
  }
  mensioning(x) {
    if (x === 50) {
      this.showMensionPickUp = true;
    }
  }
  break(x) {
    this.showMensionPickUp = false;
    this.searchFriendsList = this.friendsList;
    this.moveFocus(this.postText);
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }

  creatPost() {
    this.showProgressFlag = true;
    this.showPostButton = false;
    this.progressBarval = 0.1;
    this.showCloseBtn = false;
    this.postReadonly = true;

    let emptyVar;
    let count = 0;
    let mensionIds: number[] = [];

    this.tempPostContent = this.postContent;
    // console.log('this.tempReplacement', this.tempReplacement);
    if (this.tempReplacement.length !== 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.tempReplacement.length; i++) {
        const xDx = this.tempReplacement[i];
        mensionIds.push(xDx.id);
        this.tempPostContent = this.tempPostContent.replace(`@${xDx.replaced}`, ` <a href=\'${xDx.id}\' class=\'make_a_tag\'> ${xDx.name} </a> `);
      }
      if (mensionIds.length === 0) {
        mensionIds = emptyVar;
      }
      const garbageSubString = this.occurrences(this.tempPostContent, '↵', false);
      for (let j = 0; j <= garbageSubString; j++) {
        this.tempPostContent = this.tempPostContent.replace('↵', ' ');
      }
    }
    let tempImageArray: any[] = [];
    this.mediaArray.forEach(element => {
      if (element.thumbname) {
        tempImageArray.push({
          originalImage: element.name,
          thumbnailImage: element.thumbname
        });
        count = count + 1;
      } else if (element.asset_url) {
        count = count + 1;
      } else {
        tempImageArray.push({ id: element.id });
        count = count + 1;
      }
    });
    // const uploadInt = setInterval(() => {
    // if (flag === true || this.ifEditied) {
    if (count === this.mediaArray.length) {
      if (tempImageArray.length === 0) {
        tempImageArray = this.tempVar;
      }
      if (mensionIds.length === 0) {
        mensionIds = this.tempVar;
      }
      this.apiService.savePostTimeline(this.postData.id,
        this.userDetail.id, this.tempPostContent, emptyVar, tempImageArray, mensionIds).subscribe((event: HttpEvent<any>) => {
          // console.log('postAfter upload', event.type);
          switch (event.type) {
            case HttpEventType.Sent:
              this.progressBarval = 0.3;
              // console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              this.progressBarval = 1;
              // console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              this.progressBarval = Math.round(event.loaded / event.total) - 0.07;
              // console.log(`Uploaded! ${this.progressBarval}%`);
              break;
            case HttpEventType.Response:
              // console.log('User successfully created!', event.body);
              setTimeout(() => {
                this.tempPostContent = '';
                this.postContent = '';
                this.mediaArray = [];
                this.progressBarval = 0;
                this.showProgressFlag = false;
                this.back();
                // clearInterval(uploadInt);
              }, 150);
          }
        });
    }
    // }, 3000);
  }
  // ------Branch Riddhi -----

  async attachMediaInPost() {
    if (this.platform.is('android')) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.captureImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Camera);
            this.getImageForIos();
          }
        }, {
          text: this.captureVideoString,
          handler: () => {
            this.captureVideo();
          }
        }, {
          text: this.pickImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Photos);
            this.getImageForIos();
          }
        },
        {
          text: this.pickVideoString,
          handler: () => {
            const options: CameraOptions = {
              quality: 100,
              destinationType: (<any>window).Camera.DestinationType.FILE_URI,
              sourceType: (<any>window).Camera.PictureSourceType.PHOTOLIBRARY,
              mediaType: (<any>window).Camera.MediaType.VIDEO
            };
            this.camera.getPicture(options).then(async (data) => {
              this.showLoadingImage = true;
              this.selectedMediaLoader.push(data);
              this.videoProcesComplete = false;
              const VideoEditorOptions = {
                OptimizeForNetworkUse: {
                  NO: 0,
                  YES: 1
                },
                OutputFileType: {
                  M4V: 0,
                  MPEG4: 1,
                  M4A: 2,
                  QUICK_TIME: 3
                }
              };
              this.videoEditor.getVideoInfo({
                fileUri: 'file://' + data,
              }).then(vidInfo => {
                if (vidInfo.size > 270000000) {
                  this.utilServ.presentToast(this.fileSizeLargeString);
                  this.videoProcesComplete = true;
                  this.selectedMediaLoader.pop();
                  return;
                } else {
                  this.videoEditor.transcodeVideo({
                    fileUri: 'file://' + data,
                    outputFileName: this.utilServ.getTimeStamp(),
                    outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                    optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.NO,
                    maintainAspectRatio: true,
                    videoBitrate: 20000000,
                    fps: 30,
                    saveToLibrary: false
                  }).then(async (fileUri: string) => {
                    const webPathVideo = Capacitor.convertFileSrc(fileUri);
                    const response = await fetch(webPathVideo);
                    const blb = await response.blob();
                    this.apiService.uploadTimelineMedia(blb, this.userDetail.id, this.utilServ.getTimeStamp() + '.MP4').
                      subscribe((uploadRes: any) => {
                        if (uploadRes.success === 1) {
                          this.showLoadingImage = false;
                          this.selectedMediaLoader.pop();
                          this.videoProcesComplete = true;
                          this.mediaArray.unshift(uploadRes.message.info);
                        } else {
                          this.showLoadingImage = false;
                          this.videoProcesComplete = true;
                          this.selectedMediaLoader = [];
                          this.utilServ.presentToast(this.uploadMedialErrorString);
                        }
                      });
                  }, (err) => {
                    console.log(err);
                  });
                }
              });
            }).catch((error: any) => console.log('CameraError', error));
          }
        }]
      });
      await actionSheet.present();
    } else if (this.platform.is('ios')) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.captureImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Camera);
            this.getImageForIos();
          }
        }, {
          text: this.captureVideoString,
          handler: () => {
            this.captureVideoForIos();
          }
        }, {
          text: this.pickImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Photos);
            this.getImageForIos();
          }
        }, {
          text: this.pickVideoString,
          handler: () => {
            const options: CameraOptions = {
              quality: 50,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              mediaType: this.camera.MediaType.VIDEO,
            };
            this.camera.getPicture(options).then(async (data) => {
              this.showLoadingImage = true;
              this.videoProcesComplete = false;
              this.selectedMediaLoader.push(data);
              this.file.resolveLocalFilesystemUrl(data).then((entry: FileEntry) => {
                entry.file(file => {
                  if ((file.size / 1024 / 1024) > 270) {
                    this.utilServ.presentToast(this.fileSizeLargeString);
                    this.videoProcesComplete = true;
                    this.selectedMediaLoader.pop();
                    return;
                  } else {
                    const reader = this.getReader();
                    reader.onloadend = () => {
                      const imgBlob = new Blob([reader.result], {
                        type: file.type
                      });

                      this.apiService.uploadTimelineMedia(imgBlob, this.userDetail.id, this.utilServ.getTimeStamp() + ".MOV").
                        subscribe((uploadRes: any) => {
                          if (uploadRes.success === 1) {
                            this.showLoadingImage = false;
                            this.videoProcesComplete = true;
                            this.selectedMediaLoader.pop();
                            this.mediaArray.unshift(uploadRes.message.info);
                          } else {
                            this.showLoadingImage = false;
                            this.videoProcesComplete = true;
                            this.selectedMediaLoader = [];
                            this.utilServ.presentToast(this.uploadMedialErrorString);
                          }
                        });
                    };
                    reader.readAsArrayBuffer(file);
                  }
                });
              });
            }).catch((error: any) => console.log('videossss error', error));
          }
        }]
      });
      await actionSheet.present();
    } else if (this.platform.is('desktop')) {
      const actionSheet = await this.actionSheetController.create({
        buttons: [{
          text: this.captureImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Camera);
            this.getImageForIos();
          }
        },
        // {
        //   text: this.captureVideoString,
        //   handler: () => {
        //     this.captureVideo();
        //   }
        // }, 
        {
          text: this.pickImageString,
          handler: () => {
            this.nativeLib.takePicture(CameraSource.Photos);
            this.getImageForIos();
          }
        }, {
          text: this.pickVideoString,
          handler: () => {
            this.userInputElementForIos.click();
          }
        }]
      });
      await actionSheet.present();
    }
  }
  getReader() {
    const reader = new FileReader();
    const zoneOriginalInstance = (reader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || reader;
  }
  captureVideoForIos() {
    this.nativeLib.captureVideoForIos();
    this.eventCustom.subscribe('videoReady', (vidData) => {
      if (vidData) {
        console.log("videodata", vidData);
        this.showLoadingImage = true;
        this.videoProcesComplete = false;
        this.selectedMediaLoader.push(vidData);
        this.apiService.uploadTimelineMedia(vidData, this.userDetail.id, this.utilServ.getTimeStamp() + ".MOV").subscribe((uploadRes: any) => {
          // console.log('uploadRes', uploadRes);
          if (uploadRes.success === 1) {
            this.showLoadingImage = false;
            this.videoProcesComplete = true;
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
          } else {
            this.showLoadingImage = false;
            this.videoProcesComplete = true;
            this.selectedMediaLoader = [];
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
        this.eventCustom.destroy('videoReady');
      }
    });
  }
  captureImage() {
    this.nativeLib.captureImage(CameraSource.Camera);
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        this.showLoadingImage = true;
        this.selectedMediaLoader.push(imgData.blob);
        this.apiService.uploadTimelineMedia(imgData.blob, this.userDetail.id, imgData.filename).subscribe((uploadRes: any) => {
          if (uploadRes.success === 1) {
            this.showLoadingImage = false;
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
          } else {
            this.showLoadingImage = false;
            this.selectedMediaLoader = [];
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
        // console.log('uploadRes', this.mediaArray);
        this.eventCustom.destroy('imageReady');
      }
    });
  }
  captureVideo() {
    this.nativeLib.captureVideo();
    this.eventCustom.subscribe('videoReady', (vidData) => {
      if (vidData) {
        this.showLoadingImage = true;
        this.videoProcesComplete = false;
        this.selectedMediaLoader.push(vidData.blob);
        this.apiService.uploadTimelineMedia(vidData.blob, this.userDetail.id, vidData.filename).subscribe((uploadRes: any) => {
          // console.log('uploadRes', uploadRes);
          if (uploadRes.success === 1) {
            this.showLoadingImage = false;
            this.videoProcesComplete = true;
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
          } else {
            this.showLoadingImage = false;
            this.videoProcesComplete = true;
            this.selectedMediaLoader = [];
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
        this.eventCustom.destroy('videoReady');
      }
    });
  }
  getImageForIos() {
    // this.nativeLib.presentActionSheetCamOrGall();
    this.eventCustom.subscribe('imageReady', (imgData) => {
      if (imgData) {
        this.showLoadingImage = true;
        this.selectedMediaLoader.push(imgData.blob);
        const fileName = (this.utilServ.getTimeStamp()) + ((imgData.webPath).split('/', -1).pop());
        this.apiService.uploadTimelineMedia(imgData.blob, this.userDetail.id, fileName).subscribe((uploadRes: any) => {
          if (uploadRes.success === 1) {
            this.showLoadingImage = false;
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
          } else {
            this.showLoadingImage = false;
            this.selectedMediaLoader = [];
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
        this.eventCustom.destroy('imageReady');
      }
    });
  }

  pickImageVideoFromDevice(event) {
    const x = { mediaUrl: null, blob: null, filename: null, type: null };
    if (event.target.files && event.target.files[0]) {
      const myFile = event.target.files;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < myFile.length; i++) {
        this.showLoadingImage = true;
        this.selectedMediaLoader.push(myFile[i]);
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < myFile.length; i++) {
        this.showLoadingImage = true;
        if ((myFile[i].size / 1024 / 1024) > 270) {
          this.utilServ.presentToast(this.fileSizeLargeString);
          this.selectedMediaLoader = [];
          this.showLoadingImage = false;
          return;
        }
        x.blob = new Blob([myFile[i]], { type: myFile[i].type });
        x.mediaUrl = this.showImage(x.blob);
        x.filename = myFile[i].name;
        if ((this.imageExtArray.includes(myFile[i].type)) || (this.vidExtArray.includes(myFile[i].type))) {
          x.type = myFile[i].type;
        } else {
          // alert(this.mediaTypeNotFoundString);
          this.selectedMediaLoader = [];
          this.showLoadingImage = false;
          return;
        }
        x.type = myFile[i].type;
        this.apiService.uploadTimelineMedia(x.blob, this.userDetail.id, x.filename).subscribe((uploadRes: any) => {
          if (uploadRes.success === 1) {
            this.selectedMediaLoader.pop();
            this.mediaArray.unshift(uploadRes.message.info);
          } else {
            this.showLoadingImage = false;
            this.utilServ.presentToast(this.uploadMedialErrorString);
          }
        });
      }
    }
  }

  showImage(image) {
    const imageURL = window.URL.createObjectURL(image);
    return this.sanitizer.bypassSecurityTrustUrl(imageURL);
  }
  formateFileName(filename) {
    let nameBeforeSpace: string = (filename.split(' '))[0];
    nameBeforeSpace = nameBeforeSpace.replace(/\s/g, '_');
    nameBeforeSpace = nameBeforeSpace.replace(/\./g, '_');
    const ext = (filename.split('.')).pop();
    const newFileName = this.userDetail.id + '_' + (this.utilServ.getTimeStamp()) + '_' + nameBeforeSpace + '.' + ext;
    return newFileName;
  }
  removeimg(imgId, i) {
    if (imgId) {
      const temp = {
        id: imgId,
      };
      this.ifEditied = true;
      this.mediaArray.push(temp);
    }
    this.mediaArray.splice(i, 1);
    // console.log(this.mediaArray);
  }

  async openMultiMedia(fullAsserts, i) {
    //   const xDx = {
    //     asserts: fullAsserts,
    //     currentIndex: i
    //   };
    //   localStorage.setItem('mediaArray', JSON.stringify(xDx));
    //   const modal = await this.modalcontrolller.create({
    //     component: MultimediaViewComponent,
    //     // cssClass: 'sharePOP',
    //     componentProps: {
    //       // custom_id: this.shareValue
    //       swipeToClose: true
    //     }
    //   });
    //   return await modal.present();
  }
  back() {
    this.modalController.dismiss();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.editPostString = this.utilServ.getLangByCode('edit_post');
      this.saveString = this.utilServ.getLangByCode('save');
      this.galleryString = this.utilServ.getLangByCode('gallery');
      this.takePictureString = this.utilServ.getLangByCode('take_photo');
      this.takeVideoString = this.utilServ.getLangByCode('take_video');
      this.fileSizeLargeString = this.utilServ.getLangByCode('common.label.fileTooLargeWarning');
      this.captureImageString = this.utilServ.getLangByCode('take_photo');
      this.captureVideoString = this.utilServ.getLangByCode('take_video');
      this.pickImageString = this.utilServ.getLangByCode('choose_image');
      this.pickVideoString = this.utilServ.getLangByCode('choose_video');
    }
  }
}
