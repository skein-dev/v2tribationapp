import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { Plugins } from '@capacitor/core';
import { IonSlides } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about-tribation',
  templateUrl: './about-tribation.page.html',
  styleUrls: ['./about-tribation.page.scss'],
})
export class AboutTribationPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('content') content: any;


  aboutTribationString = 'About'
  clickToKnowMoreString = 'Click here to know more about Tribation';
  lastSlideString = 'Tribation is on a mission to connect athletes, scouts, and sports fans all across the world.';
  introSlides: any;
  videoData: any;

  localSlideContentArray = {
    slide1: 'Tribation is a social platform built around the athlete, with features designed to empower the aspiring and enhance the professional.',
    slide2: 'Tribation offers photo and video uploading, social groups and personal teams, and gives you the ability to follow your favourite teams in real time.',
    slide3: 'Amateur and aspiring athletes can make themselves available on our in depth scouting platform which allows talent scouts from all around to contact the athlete directly and take them to the next step',
    slide4: 'The versatile scouting tools offer the ability to search for athletes by sport, position, experience, location and much more, keeping your results focused and accessible.',
    slide5: 'Tribation is on a mission to connect athletes, scouts, and sports fans all across the world.'
  };
  public slideOptions = {
    effect: 'cube',
    speed: 200,
  };

  constructor(private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private location: Location,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      if (this.utilServ.langSetupFLag) {
        this.localLang();
      }
      this.apiService.getIntroData().subscribe((res: any) => {
        this.introSlides = res.message;
        if (this.utilServ.langSetupFLag) {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.introSlides.length; x++) {
            this.introSlides[x].content = this.utilServ.getLangByCode(this.introSlides[x].content);
          }
        } else {
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.introSlides.length; x++) {
            this.introSlides[x].content = this.localSlideContentArray[this.introSlides[x].content];
          }
        }
        this.slides.startAutoplay();
      });
      this.apiService.getIntroVideoData().subscribe((res: any) => {
        if (res) {
          this.videoData = res.message;
          if (this.videoData) {
            this.videoData.forEach(element => {
              if (element.content) {
                element.content = this.utilServ.getLangByCode(element.content);
                element.showMore = false
              }
            });
          }
        }
      });
    });
  }

  ngOnInit() {
  }
  trimString(string, length) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }
  back() {
    this.location.back();
  }
  localLang() {
    this.aboutTribationString = this.utilServ.getLangByCode('about');
    this.clickToKnowMoreString = this.utilServ.getLangByCode('clickToKnowMore');
    this.lastSlideString = this.utilServ.getLangByCode('lastSlideString');
  }
  scrollOnClick() {
    setTimeout(() => {
      this.content.scrollToPoint(0, 400, 100);
    }, 150);
  }
}
