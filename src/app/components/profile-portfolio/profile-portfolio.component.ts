import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController, IonSelect, IonReorderGroup } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { AddSectionComponent } from './add-section/add-section.component';

interface WorkHistory {
  id: number;
  jobTitle: string;
  employer: string;
  dateTo: string;
  dateFrom: string;
  decsribtion: string;
}
interface TeamHistory {
  id: number;
  teamName: string;
  positionName: string;
  positionId: number;
  coach: string;
  sportsId: number;
  sportsName: string;
  sportsIcon: string;
  dateTo: string;
  dateFrom: string;
  description: string;
}
interface FormalTraning {
  id: number;
  academyName: string;
  level: string;
  dateTo: string;
  dateFrom: string;
  sportsId: number;
  sportsName: string;
  sportsIcon: string;
  instructor: string;
  description: string;
}
// eduId, userId, schoolName, educationLevel, programName, gradeOfEdu, desc, fromDate, toDate, itemorderPosition
interface Education {
  id: number;
  schoolName: string;
  level: string;
  program: string;
  score: string;
  dateTo: string;
  dateFrom: string;
  description: string;
}

interface Awards {
  id: number;
  awardName: string;
  adwardedBy: string;
  date: string;
}

interface Highlights {
  id: number;      // Static
  title: string;  // static
  media: {
    id: number;
    title: string;
    assetId: number;
    originalImage: string; // Uploading New
    thumbnailImage: string; // Uploading New
    // orderPosition
  };
}

interface Aspiration {
  id: number;
  title: string;
  text: string;
}

interface EntriesSats {
  id: number;
  key: string;
  value: string;
  // orderPosition
}
interface Statistics {
  id: number;      // Static
  title: string;  // static
  entries: EntriesSats[];
}
@Component({
  selector: 'app-profile-portfolio',
  templateUrl: './profile-portfolio.component.html',
  styleUrls: ['./profile-portfolio.component.scss'],
})

export class ProfilePortfolioComponent implements OnInit {

  @ViewChild('addSection') addSectionPop: IonSelect;
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  environment;

  customAlertOptions: any;
  hideAddSection = true;
  userDetails;
  userInfo: any = null;
  editBlock = false;
  userWorkHistory: any[] = [];
  userFormalTraning: any[] = [];
  userTeamHistory: any[] = [];
  userEducation: any[] = [];
  userAwards: any[] = [];
  userAspiration: any = null;
  userStats: any = null;
  addSectionVal = null;
  countryList: any;
  maxToday;
  profileAddFlag = false;
  workHistoryAddFlag = false;
  teamHistoryAddFlag = false;
  formalTraningAddFlag = false;
  educationAddFlag = false;
  highlitsAddFlag = false;
  statisticsAddFlag = false;
  awardsAddFlag = false;
  aspirationsAddFlag = false;
  sportsList: any;
  portfolioByScout = false;
  currentLocation: any;
  showEdit: boolean;
  porfileId: number;
  editItem;
  isScout = false;
  isMinor = false;
  userStatus: any = {};
  countryData: any;
  isGuarded = false;

  // userHighlits: Highlights;

  // Strings
  dateString = 'Date';
  descriptionString = 'Description';
  firstNameString = 'First Name';
  middleNameString = 'Middle Name';
  lastNameString = 'Last Name';
  genderString = 'Gender';
  birthdayString = 'Birthday';
  cityString = 'City';
  countryString = 'Country';
  heightString = 'Height';
  weightString = 'Weight';
  levelString = 'Level';
  addSectionString = 'Add Section';
  portfolioString = 'Portfilio';
  infoBlockString = 'Information Block';
  workHistoryString = 'Work History';
  teamHistoryString = 'Team History';
  formalTraningString = 'Formal Traning';
  sportString = 'Sports';
  sportsString = 'Sports';
  educationString = 'Education';
  highlitsString = 'Highlights';
  statisticsString = 'Statistics';
  awardsString = 'Awards';
  aspirationsString = 'Aspirations';
  jobTitleString = 'Job Title';
  employerString = 'Employer';
  atStiing = 'At';
  coachString = 'Coach';
  positionString = 'Position';
  presentString = 'Present';
  instructorString = 'Instructor';
  GuardedByString = 'Guarded By';
  constructor(
    private actRouter: ActivatedRoute,
    private modalController: ModalController,
    private apiService: ApiService,
    private router: Router,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.countryData = null;
      this.countryList = this.utilServ.getCountryList();
      this.sportsList = this.utilServ.getSportsList();
      this.portfolioByScout = JSON.parse(localStorage.getItem('portfolioByScout'));
      this.countryData = this.utilServ.getCountryList();
      // this.userStatus.forEach(element => {
      //   if (element.guardianData.country_code){
      //     const xDx = this.countryData.filter(d => d.CC_ISO === element.guardianData.country_code);
      //     if (xDx[0]) {
      //       element.country = xDx[0].COUNTRY_NAME;
      //     }
      //   }
      // });


      // console.table(this.sportsList);
      this.userDetails = JSON.parse(this.utilServ.getUserDetails());
      if (this.userDetails.email_status === 'verified' && this.userDetails.user_type === 'scout'
        && this.userDetails.scout_status === 'active') {
        this.isScout = true;
      }

      this.maxToday = this.utilServ.minToday();
      this.currentLocation = JSON.parse(localStorage.getItem('currentLocation'));

      const x: string = this.currentLocation.substr(9, this.currentLocation.length);
      this.porfileId = Number(x.split('/')[0]);
      if (this.userDetails.id !== this.porfileId) {
        // console.log(':::Case 1:::');
        this.showEdit = false;
      } else if (this.userDetails.id === this.porfileId) {
        // console.log(':::Case 2:::');
        this.showEdit = true;
      }

      // this.workHistoryFun();
      // this.formalTraningFun();
      // this.teamHistoryFun();
      // this.awardsFun();
      // this.educationFun();
      this.baseInfoFun();
      this.getPortfolioUser();
      this.injectDummydata();
      this.getLanguageStrings();
      setTimeout(() => {
        this.userStatus = JSON.parse(localStorage.getItem('guardianData'));
        if (Object.keys(this.userStatus).length > 0) {
          this.isGuarded = true;
        }
      }, 1000);
    });

  }

  ngOnInit() {
    this.environment = environment;
    this.customAlertOptions = {
      animated: true,
      translucent: true,
      header: this.addSectionString,
      mode: 'ios',
      cssClass: 'addSectionProtfolio',
    };
    // console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",);

    // this.userStatus.forEach(element => {
    // });
    // this.apiService.deletePortfolioStatistics(4, 19).subscribe((e:any)=>{
    //   console.log(e);
    // })
  }

  getPortfolioUser() {

    this.apiService.getPortfolio(this.porfileId).subscribe((portfolio: any) => {
      const x = portfolio.message;
      // console.log('Portfolio data', x);
      if (x.user.age <= 18) {
        this.isMinor = true;
      }
      this.userWorkHistory = [];
      this.userFormalTraning = [];
      this.userTeamHistory = [];
      this.userEducation = [];
      this.userAwards = [];
      this.userAspiration = null;
      // x.user
      if (x.workHistory) {
        x.workHistory.forEach(wH => {
          const tempWork: WorkHistory = {
            id: wH.id,
            jobTitle: wH.job_title,
            employer: wH.employer_name,
            dateFrom: this.utilServ.getYYYY_MM_DD(wH.from_date),
            dateTo: (wH.to_date ? this.utilServ.getYYYY_MM_DD(wH.to_date) : this.presentString),
            decsribtion: wH.description
          };
          this.userWorkHistory.push(tempWork);
        });
      }
      if (x.teamHistory) {
        x.teamHistory.forEach(tH => {
          const xDxTeam = (this.sportsList.filter(d => d.id === tH.sport_id))[0];
          const tempTeam: TeamHistory = {
            id: tH.id,
            coach: tH.coach,
            description: tH.player_pos,
            dateFrom: this.utilServ.getYYYY_MM_DD(tH.from_date),
            dateTo: (tH.to_date ? this.utilServ.getYYYY_MM_DD(tH.to_date) : this.presentString),
            positionName: tH.position,
            positionId: tH.position_id,
            sportsId: tH.sport_id,
            sportsName: tH.sport,
            sportsIcon: xDxTeam.icon_class,
            teamName: tH.team_name,
          };
          this.userTeamHistory.push(tempTeam);
        });
      }
      if (x.trainingHistory) {
        x.trainingHistory.forEach(tH => {
          const xDxTrain = (this.sportsList.filter(d => d.id === tH.sport_id))[0];
          const tempTrain: FormalTraning = {
            id: tH.id,
            instructor: tH.instructor_name,
            description: tH.description,
            dateFrom: this.utilServ.getYYYY_MM_DD(tH.from_date),
            dateTo: (tH.to_date ? this.utilServ.getYYYY_MM_DD(tH.to_date) : this.presentString),
            academyName: tH.academy_name,
            level: tH.training_level,
            sportsId: tH.sport_id,
            sportsName: tH.sport,
            sportsIcon: xDxTrain.icon_class,
          };
          this.userFormalTraning.push(tempTrain);
        });
      }
      if (x.educationHistory) {
        x.educationHistory.forEach(eH => {
          const tempEdu: Education = {
            id: eH.id,
            schoolName: eH.school_name,
            level: eH.education_level,
            program: eH.academy_name,
            score: eH.grade,
            description: eH.description,
            dateFrom: this.utilServ.getYYYY_MM_DD(eH.from_date),
            dateTo: (eH.to_date ? this.utilServ.getYYYY_MM_DD(eH.to_date) : this.presentString),
          };
          this.userEducation.push(tempEdu);
        });
      }
      if (x.awards) {
        x.awards.forEach(aH => {
          const awardTemp: Awards = {
            id: aH.id,
            awardName: aH.award_name,
            adwardedBy: aH.awarded_by,
            date: this.utilServ.getYYYY_MM_DD(aH.award_date),
          };
          this.userAwards.push(awardTemp);
        });
      }
      if (x.text) {
        const asp = x.text[0];
        if (asp) {
          const aspriationTemp: Aspiration = {
            id: asp.id,
            text: asp.text,
            title: asp.title
          };
          this.userAspiration = aspriationTemp;
        }
      }
      if (x.statistics) {
        const st = x.statistics[0];
        if (st) {
          if (st.entries.length > 0) {
            const statTemp: Statistics = {
              id: st.id,
              title: st.title,
              entries: st.entries
            };
            this.userStats = statTemp;
          }
        }

      }
    });

  }

  async addSectionFun() {
    this.reset();
    this.hideAddSection = false;
    await this.addSectionPop.open();
  }
  addThisSection() {
    this.editBlock = false;
    switch (this.addSectionVal) {
      case 'workHistory': {
        this.workHistoryAddFun();
        break;
      }
      case 'teamHistory': {
        this.teamHistoryAddFun();
        break;
      }
      case 'formalTraning': {
        this.formalTraningAddFun();
        break;
      }
      case 'education': {
        this.educationAddFun();
        break;
      }
      // case 'highlits': {
      //   this.highlitsAddFun();
      //   break;
      // }
      case 'statistics': {
        this.statisticsAddFun();
        break;
      }
      case 'awards': {
        this.awardsAddFun();
        break;
      }
      case 'aspirations': {
        this.aspirationsAddFun();
        break;
      }
      default: {
        break;
      }
    }
  }

  baseInfoFun() {
    this.apiService.getBasicUserInfo(Number(this.porfileId)).subscribe((userData: any) => {
      const x = userData.message;
      // console.log("x", x);
      let z = {
        id: x.id,
        language: x.language,
        lastName: x.last_name,
        profileBackground: x.profile_bg_img_url,
        profileImg: x.profile_img_url,
        profileImgThumb: x.profile_img_url_thump,
        city: x.city,
        age: x.age,
        firstName: x.first_name,
        gender: x.gender,
        birthday: this.utilServ.getYYYY_MM_DD(x.birthday),
        countryCode: x.country_code,
        email: x.email,
        height: x.heightFt,
        heightUnit: x.height_unit,
        telephone: x.telephone,
        userType: x.user_type,
        weight: x.weightLbs,
        weightUnit: x.weight_unit,
        stateProvince: x.stateProvince,
        country: null
      };

      if (z.countryCode !== '0') {
        const xDx = this.countryList.filter(d => d.CC_ISO === z.countryCode);
        z.country = xDx[0].COUNTRY_NAME;
      }
      this.userInfo = z;
    });

  }
  editProfile(x) {
    if (this.editBlock === true) {
      this.editItem = x.id;
      this.profileAddFlag = true;
      this.addSelectedSection();
    }
  }

  reset() {
    this.addSectionVal = null;
    this.editItem = null;
    this.profileAddFlag = false;
    this.workHistoryAddFlag = false;
    this.teamHistoryAddFlag = false;
    this.formalTraningAddFlag = false;
    this.educationAddFlag = false;
    this.awardsAddFlag = false;
    this.highlitsAddFlag = false;
    this.statisticsAddFlag = false;
    this.aspirationsAddFlag = false;
  }
  workHistoryAddFun() {
    this.workHistoryAddFlag = true;
    this.addSelectedSection();
  }
  editWorkItem(x, item) {
    if (this.editBlock === true) {
      this.editItem = item;
      this.workHistoryAddFun();
    }
  }

  teamHistoryAddFun() {
    this.teamHistoryAddFlag = true;
    this.addSelectedSection();
  }
  editTeamItem(x, item) {
    if (this.editBlock === true) {
      this.editItem = item;
      this.teamHistoryAddFun();
    }
  }

  formalTraningAddFun() {
    this.formalTraningAddFlag = true;
    this.addSelectedSection();
  }
  editFormalItem(x, item) {
    if (this.editBlock === true) {
      this.editItem = item;
      this.formalTraningAddFun();
    }
  }

  educationAddFun() {
    this.educationAddFlag = true;
    this.addSelectedSection();
  }
  editEduItem(x, item) {
    if (this.editBlock === true) {
      this.editItem = item;
      this.educationAddFun();
    }
  }

  awardsAddFun() {
    this.awardsAddFlag = true;
    this.addSelectedSection();
  }
  editAwardItem(x, item) {
    if (this.editBlock === true) {
      this.editItem = item;
      this.awardsAddFun();
    }
  }

  highlitsAddFun() {
    this.highlitsAddFlag = true;
    this.addSelectedSection();
  }

  statisticsAddFun() {
    if (this.userStats) {
      localStorage.setItem('statsData', JSON.stringify(this.userStats.id));
    }
    this.statisticsAddFlag = true;
    this.addSelectedSection();
  }
  editStatItem(x, item) {
    if (this.editBlock === true) {
      this.editItem = item;
      this.statisticsAddFun();
    }
  }

  aspirationsAddFun() {
    if (!this.userAspiration) {
      this.aspirationsAddFlag = true;
      this.addSelectedSection();
    }
  }
  editAspItem(x, item) {
    if (this.editBlock === true) {
      this.editItem = item;
      this.aspirationsAddFlag = true;
      this.addSelectedSection();
    }
  }

  async addSelectedSection() {
    const dataToSend = {
      profile: this.profileAddFlag,
      workHistory: this.workHistoryAddFlag,
      teamHistory: this.teamHistoryAddFlag,
      formalTraning: this.formalTraningAddFlag,
      education: this.educationAddFlag,
      awards: this.awardsAddFlag,
      highlits: this.highlitsAddFlag,
      statistics: this.statisticsAddFlag,
      aspirations: this.aspirationsAddFlag,
      editItem: this.editItem
    };
    localStorage.setItem('addPortfolioSection', JSON.stringify(dataToSend));
    const modal = await this.modalController.create({
      component: AddSectionComponent,
      cssClass: 'portfolioAddSetion',
    });
    modal.onDidDismiss().then((sectionRes) => {
      localStorage.removeItem('addPortfolioSection');
      this.editBlock = false;
      this.reset();
      this.baseInfoFun();
      this.getPortfolioUser();
      // if (sectionRes.data) {
      //   if (sectionRes.data.data === 'workHistory') {
      //     this.refreshWorkHistory()
      //   }
      // }
    });

    return await modal.present();
  }

  // refreshWorkHistory() {
  //   this.apiService.getWorkHistory(this.userDetails.id).pipe().subscribe((workRes: any) => {
  //     console.log(workRes);
  //   });
  // }

  back() {
    if (this.portfolioByScout === true) {
      localStorage.removeItem('guardianData');
      localStorage.removeItem('portfolioByScout');
      this.modalController.dismiss();
      this.router.navigate(['/scouts']);
    } else {
      this.modalController.dismiss();
    }
  }
  openPortfolio(p) {
    this.modalController.dismiss();
    this.router.navigate([`/profile/${p}`]);
  }
  sendChat(x) {
    this.modalController.dismiss();
    this.utilServ.navChatwithId(x);
  }

  injectDummydata() {
    // const tempAsp: Aspiration = {
    //   id: null,
    //   text: 'The About page is essential to any and every website, whether you’re an individual sharing your personal thoughts or a full-blown business with countless landing pages. Your About page isn’t necessarily what gets people to your website, but it is where a number of visitors are going to click over to.',
    //   title: 'About Me'
    // };
    // this.userAspiration = tempAsp;
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.middleNameString = this.utilServ.getLangByCode('');   // needTosee - string not available
      this.levelString = this.utilServ.getLangByCode('levelString');
      this.addSectionString = this.utilServ.getLangByCode('addSectionString');
      this.portfolioString = this.utilServ.getLangByCode('profileString');
      this.infoBlockString = this.utilServ.getLangByCode('infoBlockString');             // needTosee - string not available
      this.workHistoryString = this.utilServ.getLangByCode('workHistoryString');
      this.teamHistoryString = this.utilServ.getLangByCode('teamHistoryString');
      this.formalTraningString = this.utilServ.getLangByCode('formalTraningString');
      this.educationString = this.utilServ.getLangByCode('educationString');
      this.highlitsString = this.utilServ.getLangByCode('highlitsString');
      this.statisticsString = this.utilServ.getLangByCode('statisticsString');
      this.awardsString = this.utilServ.getLangByCode('awardsString');
      this.aspirationsString = this.utilServ.getLangByCode('aspirationsString');
      this.jobTitleString = this.utilServ.getLangByCode('jobTitleString');
      this.employerString = this.utilServ.getLangByCode('employerString');
      this.atStiing = this.utilServ.getLangByCode('atStiing');
      this.coachString = this.utilServ.getLangByCode('coachString');
      this.positionString = this.utilServ.getLangByCode('position');
      this.presentString = this.utilServ.getLangByCode('presentString');
      this.instructorString = this.utilServ.getLangByCode('instructorString');
      this.descriptionString = this.utilServ.getLangByCode('description');
      this.dateString = this.utilServ.getLangByCode('date');
      this.firstNameString = this.utilServ.getLangByCode('first_name');
      this.lastNameString = this.utilServ.getLangByCode('last_name');
      this.genderString = this.utilServ.getLangByCode('gender');
      this.birthdayString = this.utilServ.getLangByCode('birthday');
      this.cityString = this.utilServ.getLangByCode('city');
      this.countryString = this.utilServ.getLangByCode('country');
      this.heightString = this.utilServ.getLangByCode('height');
      this.weightString = this.utilServ.getLangByCode('weight');
      this.sportString = this.utilServ.getLangByCode('sports');
    }
  }
}
