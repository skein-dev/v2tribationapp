import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { Plugins } from '@capacitor/core';
import { IonSlides } from '@ionic/angular';


const { SplashScreen } = Plugins;
@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  introSlides: any;
  index: any;

  skipString = 'Skip';
  nextString = 'Next';
  localSlideContentArray = {
    slide1: 'Tribation is a social platform built around the athlete, with features designed to empower the aspiring and enhance the professional.',
    slide2: 'Tribation offers photo and video uploading, social groups and personal teams, and gives you the ability to follow your favourite teams in real time.',
    slide3: 'Amateur and aspiring athletes can make themselves available on our in depth scouting platform which allows talent scouts from all around to contact the athlete directly and take them to the next step',
    slide4: 'The versatile scouting tools offer the ability to search for athletes by sport, position, experience, location and much more, keeping your results focused and accessible.',
    slide5: 'Get Started'
  };
  public slideOptions = {
    effect: 'cube',
    speed: 200,
  };

  constructor(
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.params.subscribe(data => {

      this.apiService.getIntroData().subscribe((res: any) => {
        this.introSlides = res.message;

        if (this.utilServ.langSetupFLag) {
          this.skipString = this.utilServ.getLangByCode('skip');
          this.nextString = this.utilServ.getLangByCode('next');
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
      });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 100);
  }

  navToLogin() {
    this.utilServ.setIntroStatus(1);
    this.utilServ.navLogin();
  }
  nextSlide(i) {
    this.slides.slideTo(i + 1, 10);
  }

}
