import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
// import { InViewportMetadata } from 'ng-in-viewport';
// import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';



@Component({
  selector: 'app-multimedia-view',
  templateUrl: './multimedia-view.component.html',
  styleUrls: ['./multimedia-view.component.scss'],
})
export class MultimediaViewComponent implements OnInit {
  environment;

  @ViewChild('slider', { read: ElementRef }) slider: ElementRef;
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('myVideo') myVideo: ElementRef;
  imageArray: any[] = [];
  index: any;
  sliderOpts: any;
  currentIndex: number;
  dataRes: any;
  imageExtArray = ['image/gif', 'image/jpeg', 'image/png', 'image/heic', 'image'];
  vidExtArray = ['video/webm', 'video/mpg', 'video/mp4', 'video/avi', 'video/mov', 'mp4', 'mov', 'video/3gpp', 'webm', 'video/quicktime', 'qt', 'MPEG-4', 'MPEG', 'HEIF', 'HEVC', 'MOV', 'webp', 'MP4'];
  constructor(
    private modalController: ModalController,
    // private streamingMedia: StreamingMedia,
    private actRouter: ActivatedRoute,) {
    this.actRouter.queryParams.subscribe(params => {
    });

  }
  onIntersection($event, i) {
    // const { [InViewportMetadata]: { entry }, target } = $event;
    // const ratio = entry.intersectionRatio;
    // const vid = target;
    // // console.log("ratio-------------------" + ratio);
    // ratio >= 0.65 ? vid.play() : vid.pause();
  }

  ngOnInit() {
    this.environment = environment;
    this.setupBasic();
  }
  ionViewWillEnter() {
    this.slides.update();
    const int = setInterval(() => {
      if (this.index) {
        this.slides.slideTo(this.index, 10);
        clearInterval(int);
      }
    }, 20);
    this.slides.getActiveIndex().then(index => {
      if (this.imageArray[index].post_type === 'video') {
        const vid1 = <HTMLVideoElement>document.getElementById('myVideo' + index);
        vid1.play();
        //  this.playVideo(index);
      }
    });
  }
  ionViewWillLeave() {
    this.imageArray = [];
    this.index = null;
    this.currentIndex = null;
    this.dataRes = null;
  }
  setupBasic() {
    this.dataRes = JSON.parse(localStorage.getItem('mediaArray'));
    this.imageArray = this.dataRes.asserts;
    this.index = this.dataRes.currentIndex;
    this.sliderOpts = {
      centeredSlides: true,
      slidesPerView: 1,
      zoom: true,
      speed: 0,
      setWrapperSize: true,
      initialSlide: this.dataRes.currentIndex,
      watchOverflow: true,
      centeredSlidesBounds: true,
      rotate: 50,
      stretch: 0,
      depth: 500,
      iOSEdgeSwipeThreshold: 20,
      iOSEdgeSwipeDetection: true,
      modifier: 1,
      // slideShadows: true,
    };
    const int = setInterval(() => {
      if (this.index) {
        // console.log('this.index', this.index);
        this.slides.slideTo(this.index, 10);
        clearInterval(int);
      }
    }, 20);

    // setTimeout(() => {
    //   console.log('this.index', this.index);

    //   this.slides.slideTo(this.index, 10);
    // }, 100);

  }
  close() {
    localStorage.removeItem('mediaArray');
    this.imageArray = null;
    this.modalController.dismiss();
  }
  zoom(zoomIn: boolean) {
    let zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }

  slideChanged(event) {
    this.index = this.slides.getActiveIndex();
    this.slides.getActiveIndex().then(index => {
      const currentIndex = index;
      const nextindex = index + 1;
      if (this.imageArray[nextindex]) {
        // if (this.imageArray[nextindex].post_type !== 'image') {
        const vid1 = <HTMLVideoElement>document.getElementById('myVideo' + nextindex);
        vid1.pause();
        // }
      }
    });
    this.slides.getPreviousIndex().then(index => {
      if (this.imageArray[index]) {
        // if (this.imageArray[index].post_type !== 'image') {
        const vid1 = <HTMLVideoElement>document.getElementById('myVideo' + index);
        vid1.pause();
        // }
      }
    });
  }
  swipeUp(e): any {
    this.modalController.dismiss();
  }
  // playVideo(index){
  //   let options: StreamingVideoOptions = {
  //     successCallback: () => { console.log('Video played') },
  //     errorCallback: (e) => { console.log('Error streaming') },
  //     shouldAutoClose: true,
  //     controls: true
  //   };
  //   this.streamingMedia.playVideo('https://storage.googleapis.com/tribation_uploads_dev/' + this.imageArray[index].asset_url, options);
  // }
}
