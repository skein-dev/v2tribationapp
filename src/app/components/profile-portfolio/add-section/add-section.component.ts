import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { SelectSportsOrLagacyComponent } from '../../select-sports-or-lagacy/select-sports-or-lagacy.component';
import { PositionForSportsComponent } from '../../select-sports-or-lagacy/position-for-sports/position-for-sports.component';
import { environment } from '../../../../environments/environment';
import { SelectCountryComponent } from '../../select-country/select-country.component';

interface WorkHistory {
  id: number;
  jobTitle: string;
  employer: string;
  dateTo: string;
  current: boolean;
  dateFrom: string;
  decsribtion: string;
}
interface TeamHistory {
  id: number;
  teamName: string;
  positionId: number;
  positionName: string;
  coach: string;
  sportsId: number;
  sportsName: string;
  dateTo: string;
  dateFrom: string;
  current: boolean;
  description: string;
}
interface FormalTraning {
  id: number;
  current: boolean;
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
interface Education {
  id: number;
  current: boolean;
  schoolName: string;
  level: string;
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

interface imageArray {
  id: number;
  asset_url: string;
  asset_thumb_url: string;
}

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss'],
})
export class AddSectionComponent implements OnInit {
  @ViewChild('aspBox') aspBox: any;
  environment: any;
  editDeleteMode = false;
  userDetails;
  userInfo = {
    firstName: null,
    middleName: null,
    profileImg: '',
    id: null,
    lastName: null,
    gender: null,
    birthday: null,
    age: null,
    height: null,
    heightUnit: null,
    weight: null,
    weightUnit: null,
    city: null,
    stateProvince: null,
    country: null
  };
  profileinfo: any = {};
  userWorkHistory: WorkHistory;
  userFormalTraning: FormalTraning;
  userTeamHistory: TeamHistory;
  userEducation: Education;
  userAwards: Awards;
  userHighlits: Highlights;
  userStat: Statistics;
  userStatEntries: EntriesSats;
  userAspiration: Aspiration;

  temp;
  addSectionVal = null;
  countryList: any;
  maxToday;
  profileFlag = false;
  workHistoryAddFlag = false;
  teamHistoryAddFlag = false;
  formalTraningAddFlag = false;
  educationAddFlag = false;
  highlitsAddFlag = false;
  statisticsAddFlag = false;
  awardsAddFlag = false;
  aspirationsAddFlag = false;
  sportsData: any;
  sports: any;
  sportsIcon: any;
  sportsId: any;
  positions: any;
  imagesArray: any;
  videosArray: any;
  totalImages: number;
  itemToBeEdit: any;
  maxDate: string;
  minDate: string;
  positionsArray;

  // Strings
  saveString = 'save';
  sportString = 'Sports';
  nameString = 'Name';
  descString = 'Description';
  dateFromString = 'From';
  dateToString = 'To';
  firstNameString = 'First Name';
  middleNameString = 'Middle Name';
  lastNameString = 'Last Name';
  genderString = 'Gender';
  birthdayString = 'Birthday';
  cityString = 'City';
  countryString = 'Country';
  heightString = 'Height';
  weightString = 'Weight';
  cmString = 'cm';
  inchesString = 'inches';
  feetString = 'feet';
  kgString = 'Kg';
  poundsString = 'Pounds';
  stonesString = 'Stones';

  maleString = 'Male';
  femaleString = 'Female';
  stateProvinceString = 'State/Province';
  presentString = 'Present';
  portfolioString = 'Profile';   // Changed
  infoBlockString = 'Information Block';
  workHistoryString = 'Work History';
  teamHistoryString = 'Team History';
  formalTraningString = 'Formal Traning';
  educationString = 'Education';
  highlitsString = 'Highlights';
  statisticsString = 'Statistics';
  awardsString = 'Awards';
  aspirationsString = 'Aspirations';
  jobTitleString = 'Job Title';
  employerString = 'Employer';
  atStiing = 'At';
  teamNameString = 'Team Name';
  coachString = 'Coach';
  positionString = 'Position';
  levelString = 'Level';
  instructorString = 'Instructor';
  descriptionString = 'Description';
  selectSportString = 'Select Sports';
  selectPositionString = 'Select Position';
  schoolNameString = 'School Name';
  programString = 'Program';
  otherString = 'Other';
  byString = 'By';
  onString = 'On';
  titleString = 'Title';
  aboutyouString = 'About you';
  academeyNameString = 'Academy Name';

  // otherString = 'Other';

  constructor(
    private actRouter: ActivatedRoute,
    private modalController: ModalController,
    private apiService: ApiService,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
    this.maxDate = this.utilServ.formatDateMin();
    this.minDate = this.utilServ.formatDateMax();
    this.environment = environment;
    this.actRouter.queryParams.subscribe(() => {
      this.maxToday = this.utilServ.minToday();
      const x = JSON.parse(localStorage.getItem('addPortfolioSection'));
      this.profileFlag = x.profile;
      this.aspirationsAddFlag = x.aspirations;
      this.awardsAddFlag = x.awards;
      this.educationAddFlag = x.education;
      this.formalTraningAddFlag = x.formalTraning;
      this.highlitsAddFlag = x.highlits;
      this.statisticsAddFlag = x.statistics;
      this.teamHistoryAddFlag = x.teamHistory;
      this.workHistoryAddFlag = x.workHistory;
      this.itemToBeEdit = x.editItem;
      this.userDetails = JSON.parse(this.utilServ.getUserDetails());
      this.sportsData = this.utilServ.getSportsList();

      const jgsdhfshg = {
        aspirationsAddFlag: this.aspirationsAddFlag,
        awardsAddFlag: this.awardsAddFlag,
        educationAddFlag: this.educationAddFlag,
        formalTraningAddFlag: this.formalTraningAddFlag,
        highlitsAddFlag: this.highlitsAddFlag,
        statisticsAddFlag: this.statisticsAddFlag,
        teamHistoryAddFlag: this.teamHistoryAddFlag,
        workHistoryAddFlag: this.workHistoryAddFlag,
        itemToBeEdit: this.itemToBeEdit
      };
      if (this.aspirationsAddFlag === true) {
        // this.setFocus(this.aspBox);
      }
      // console.log('Data Recived:: ', jgsdhfshg);
      this.defaultInit();

    });
    // this.apiService.deletePortfolioAspiration(4, 7).subscribe(res => {
    //   console.log(res);
    // });
  }
  ifEdit() {
    if (this.workHistoryAddFlag && this.itemToBeEdit) {
      this.userWorkHistory = this.itemToBeEdit;
      if (this.itemToBeEdit.dateTo === 'Present') {
        this.userWorkHistory.current = true;
        this.userWorkHistory.dateTo = this.temp;
      } else {
        this.userWorkHistory.current = false;
        this.userWorkHistory.dateTo = this.itemToBeEdit.dateTo;
      }
      // console.log(this.userWorkHistory);
    } else if (this.aspirationsAddFlag && this.itemToBeEdit) {
      this.userAspiration = this.itemToBeEdit;
      // console.log(this.userAspiration);
    } else if (this.formalTraningAddFlag && this.itemToBeEdit) {
      this.userFormalTraning = this.itemToBeEdit;
      const xxdd = this.getSportById(this.userFormalTraning.sportsId);
      // console.log(xxdd);
      this.sports = xxdd.name;
      this.sportsIcon = xxdd.icon_class;
      this.sportsId = xxdd.id;
      this.positions = xxdd;
      this.userFormalTraning.sportsName = this.sports;
      this.userFormalTraning.sportsId = this.sportsId;
      this.userFormalTraning.sportsIcon = this.sportsIcon;

      if (this.itemToBeEdit.dateTo === 'Present') {
        this.userFormalTraning.current = true;
        this.userFormalTraning.dateTo = this.temp;
      } else {
        this.userFormalTraning.current = false;
        this.userFormalTraning.dateTo = this.itemToBeEdit.dateTo;
      }
      // console.log(this.userFormalTraning);

    } else if (this.awardsAddFlag && this.itemToBeEdit) {
      this.userAwards = this.itemToBeEdit;
      // console.log(this.userAwards);
    } else if (this.teamHistoryAddFlag && this.itemToBeEdit) {
      this.userTeamHistory = this.itemToBeEdit;
      const xxdd = this.getSportById(this.userTeamHistory.sportsId);
      this.sports = xxdd.name;
      this.sportsIcon = xxdd.icon_class;
      this.sportsId = xxdd.id;
      this.positions = xxdd;
      this.userTeamHistory.sportsId = this.sportsId;
      this.userTeamHistory.sportsName = this.sports;
      if (this.itemToBeEdit.dateTo === 'Present') {
        this.userTeamHistory.current = true;
        this.userTeamHistory.dateTo = this.temp;
      } else {
        this.userTeamHistory.current = false;
        this.userTeamHistory.dateTo = this.itemToBeEdit.dateTo;
      }
      // console.log(this.userTeamHistory);
    } else if (this.educationAddFlag && this.itemToBeEdit) {
      this.userEducation = this.itemToBeEdit;
      if (this.itemToBeEdit.dateTo === 'Present') {
        this.userEducation.current = true;
        this.userEducation.dateTo = this.temp;
      } else {
        this.userEducation.current = false;
        this.userEducation.dateTo = this.itemToBeEdit.dateTo;
      }
      // console.log(this.userEducation);
    } else if (this.statisticsAddFlag && this.itemToBeEdit) {
      this.userStat.id = this.itemToBeEdit.statistics_id;
      this.userStat.title = 'statistics';
      this.userStatEntries.id = this.itemToBeEdit.id;
      this.userStatEntries.key = this.itemToBeEdit.key;
      this.userStatEntries.value = this.itemToBeEdit.value;
      this.userStat.entries.push(this.userStatEntries);
      // console.log(this.userStat);
    } else if (this.profileFlag && this.itemToBeEdit) {
      this.apiService.getBasicUserInfo(this.itemToBeEdit).subscribe((pro: any) => {
        if (pro.success === 1) {
          // console.log(pro.message);
          if (pro.message.country_code) {
            this.profileinfo.countryCode = pro.message.country_code;
            const tempCountry = this.utilServ.countryList.filter(d => d.CC_ISO === this.profileinfo.countryCode);
            this.profileinfo.countryName = tempCountry[0].COUNTRY_NAME;

          }
          if (pro.message.first_name) { this.profileinfo.fName = pro.message.first_name; }
          if (pro.message.last_name) { this.profileinfo.lName = pro.message.last_name; }
          if (pro.message.id) { this.profileinfo.id = pro.message.id; }
          if (pro.message.city) { this.profileinfo.city = pro.message.city; }
          if (pro.message.stateProvince) { this.profileinfo.stateProvince = pro.message.stateProvince; }
          // if (pro.message.email) { this.profileinfo.email = pro.message.email; }
          if (pro.message.profile_img_url_thump) { this.profileinfo.profileImgThumb = pro.message.profile_img_url_thump; }
          if (pro.message.heightFt) { this.profileinfo.height = pro.message.heightFt; }
          if (pro.message.height_unit) { this.profileinfo.heightUnit = pro.message.height_unit; }
          if (pro.message.weight_unit) { this.profileinfo.weightUnit = pro.message.weight_unit; }
          if (pro.message.weightLbs) { this.profileinfo.weight = pro.message.weightLbs; }
          if (pro.message.gender) { this.profileinfo.gender = pro.message.gender; }
          if (pro.message.birthday) { this.profileinfo.birthday = this.utilServ.getYYYY_MM_DD(pro.message.birthday); }
          // console.log(this.profileinfo);
        }
      });
    }

  }
  defaultInit() {
    const aspirationDefault: Aspiration = {
      id: this.temp,
      title: 'about me',
      text: this.temp
    };
    this.userAspiration = aspirationDefault;
    const workDefault: WorkHistory = {
      current: true,
      id: this.temp,
      jobTitle: this.temp,
      employer: this.temp,
      dateTo: this.temp,
      dateFrom: this.temp,
      decsribtion: this.temp
    };

    this.userWorkHistory = workDefault;

    const teamDefault: TeamHistory = {
      id: this.temp,
      current: true,
      dateFrom: this.temp,
      dateTo: this.temp,
      coach: this.temp,
      teamName: this.temp,
      sportsId: this.temp,
      sportsName: this.temp,
      positionId: this.temp,
      positionName: this.temp,
      description: this.temp
    };
    if (this.itemToBeEdit) {
      this.userWorkHistory = this.itemToBeEdit;
    } else {
      this.userTeamHistory = teamDefault;
    }
    const traningDefault: FormalTraning = {
      id: this.temp,
      current: true,
      dateFrom: this.temp,
      dateTo: this.temp,
      sportsId: this.temp,
      sportsIcon: this.temp,
      sportsName: this.temp,
      academyName: this.temp,
      instructor: this.temp,
      level: this.temp,
      description: this.temp
    };
    this.userFormalTraning = traningDefault;
    const educationDefalut: Education = {
      id: this.temp,
      current: true,
      schoolName: this.temp,
      level: this.temp,
      score: this.temp,
      dateTo: this.temp,
      dateFrom: this.temp,
      description: this.temp
    };
    this.userEducation = educationDefalut;
    const awardDefault: Awards = {
      id: this.temp,
      awardName: this.temp,
      adwardedBy: this.temp,
      date: this.temp,
    };
    this.userAwards = awardDefault;

    const highlitsDefault: Highlights = {
      id: this.temp,
      title: this.temp,
      media: {
        id: this.temp,
        title: this.temp,
        assetId: this.temp,
        originalImage: this.temp,
        thumbnailImage: this.temp
        // orderPosition
      }
    };
    this.userHighlits = highlitsDefault;
    const st = JSON.parse(localStorage.getItem('statsData'));
    const statsDefault: Statistics = {
      id: st || this.temp,
      title: this.temp,
      entries: []
    };
    this.userStat = statsDefault;
    localStorage.removeItem('statsData');

    const statsEntriesDefault: EntriesSats = {
      id: this.temp,
      key: this.temp,
      value: this.temp
    };
    this.userStatEntries = statsEntriesDefault;
    // console.log('js', this.highlitsAddFlag);

    if (this.highlitsAddFlag === true) {
      // console.log('jsakdbfsdvbfbsadjfbsadkjbfa');
      this.apiService.getAssets(55, 0, 100, 'image').subscribe((res: any) => {
        if (res.message) {
          this.totalImages = res.message.meta.total;
          this.imagesArray = res.message.content;
          this.imagesArray.forEach(e => {
            e.isChecked = false;
          });
          // console.log(this.imagesArray);
        }
      });
      this.apiService.getAssets(this.userDetails.id, 0, 100, 'video').subscribe((res: any) => {
        if (res.message) {
          this.videosArray = res.message;
        }
      });
    }

    if (this.itemToBeEdit) {
      this.editDeleteMode = true;
      // console.log('this.editDeleteMode', this.editDeleteMode);
      this.ifEdit();
    }
  }
  changeDate(x: any) {
    const sd = x.dateTo;
    if (this.itemToBeEdit !== null) {
      this.itemToBeEdit = null;
      x.dateTo = sd;
      // console.log('executed');
    } else {
      x.dateTo = '';
    }
  }
  saveProfileData() {
    // console.log('\n id:: ', this.profileinfo.id,
    //   '\n countryCode:: ', this.profileinfo.countryCode,
    //   '\n stateProvince:: ', this.profileinfo.stateProvince,
    //   '\n city:: ', this.profileinfo.city,
    //   '\n birthday:: ', this.profileinfo.birthday,
    //   '\n heightUnit:: ', this.profileinfo.heightUnit,
    //   '\n height:: ', this.profileinfo.height,
    //   '\n weightUnit:: ', this.profileinfo.weightUnit,
    //   '\n weight:: ', this.profileinfo.weight,
    //   '\n temp,:: ', this.temp,
    //   '\n gender:: ', this.profileinfo.gender);
    this.apiService.editPortfolioProfileInfo(
      this.profileinfo.id,
      this.profileinfo.countryCode,
      this.profileinfo.stateProvince,
      this.profileinfo.city,
      this.profileinfo.birthday,
      this.profileinfo.heightUnit,
      this.profileinfo.height,
      this.profileinfo.weightUnit,
      this.profileinfo.weight,
      this.temp,
      this.profileinfo.gender).subscribe((res: any) => {
        if (res.success === 1) {
          this.modalController.dismiss();
        }
      });
  }
  saveWorkData() {
    if (this.userWorkHistory.current === true) {
      this.userWorkHistory.dateTo = this.temp;
    }
    this.userWorkHistory.jobTitle = this.utilServ.formatString(this.userWorkHistory.jobTitle);
    this.userWorkHistory.dateFrom = this.utilServ.getYYYY_MM_DD(this.userWorkHistory.dateFrom);
    this.userWorkHistory.employer = this.utilServ.formatString(this.userWorkHistory.employer);
    if (this.userWorkHistory.dateTo !== '' || this.userWorkHistory.dateTo) {
      this.userWorkHistory.dateTo = this.utilServ.getYYYY_MM_DD(this.userWorkHistory.dateTo);
    } else {
      this.userWorkHistory.dateTo = this.temp;
    }
    if (this.userWorkHistory.dateFrom && this.userWorkHistory.jobTitle !== '' && this.userWorkHistory.employer !== '') {
      // console.log(this.userWorkHistory);
      this.apiService.saveWorkHistory(
        this.userWorkHistory.id,
        this.userDetails.id,
        this.userWorkHistory.jobTitle,
        this.userWorkHistory.employer,
        this.userWorkHistory.decsribtion,
        this.userWorkHistory.dateFrom,
        this.userWorkHistory.dateTo,
        this.temp).pipe().subscribe((workRes: any) => {
          // console.log(workRes);
          if (workRes.success === 1) {
            this.modalController.dismiss();
          }
        });
    }
  }

  deleteWorkHistory() {
    this.apiService.deleteWorkHistory(this.userDetails.id, this.userWorkHistory.id).subscribe((workRes: any) => {
      if (workRes.success === 1) {
        this.modalController.dismiss();
      }
    });
  }
  saveTeamData() {
    if (this.userTeamHistory.current === true) {
      this.userTeamHistory.dateTo = this.temp;
    }
    if (!this.userTeamHistory.positionId) {
      this.userTeamHistory.positionId = 0;
    }
    this.userTeamHistory.teamName = this.utilServ.formatString(this.userTeamHistory.teamName);
    this.userTeamHistory.coach = this.utilServ.formatString(this.userTeamHistory.coach);
    this.userTeamHistory.dateFrom = this.utilServ.getYYYY_MM_DD(this.userTeamHistory.dateFrom);
    if (this.userTeamHistory.dateTo !== '' || this.userTeamHistory.dateTo) {
      this.userTeamHistory.dateTo = this.utilServ.getYYYY_MM_DD(this.userTeamHistory.dateTo);
    } else {
      this.userTeamHistory.dateTo = this.temp;
    }
    this.apiService.saveTeamHistory(this.userTeamHistory.id,
      this.userDetails.id,
      this.userTeamHistory.teamName,
      this.userTeamHistory.coach,
      this.userTeamHistory.sportsId,
      this.userTeamHistory.description,
      this.userTeamHistory.positionId,
      this.userTeamHistory.dateFrom,
      this.userTeamHistory.dateTo,
      this.temp).pipe().subscribe((teamRes: any) => {
        if (teamRes.success === 1) {
          this.modalController.dismiss();
        }
      });
  }
  deleteTeamHistory() {
    this.apiService.deleteTeamHistory(this.userDetails.id, this.userTeamHistory.id).subscribe((teamRes: any) => {
      if (teamRes.success === 1) {
        this.modalController.dismiss();
      }
    });
  }

  saveTraningData() {
    if (this.userFormalTraning.current === true) {
      this.userFormalTraning.dateTo = this.temp;
    }
    this.userFormalTraning.academyName = this.utilServ.formatString(this.userFormalTraning.academyName);
    this.userFormalTraning.instructor = this.utilServ.formatString(this.userFormalTraning.instructor);
    this.userFormalTraning.level = this.utilServ.formatString(this.userFormalTraning.level);
    this.userFormalTraning.dateFrom = this.utilServ.getYYYY_MM_DD(this.userFormalTraning.dateFrom);
    if (this.userFormalTraning.dateTo !== '' || this.userFormalTraning.dateTo) {
      this.userFormalTraning.dateTo = this.utilServ.getYYYY_MM_DD(this.userFormalTraning.dateTo);
    } else {
      this.userFormalTraning.dateTo = this.temp;
    }

    this.apiService.saveTrainingHistory(this.userFormalTraning.id,
      this.userDetails.id,
      this.userFormalTraning.academyName,
      this.userFormalTraning.instructor,
      this.userFormalTraning.level,
      this.userFormalTraning.sportsId,
      this.userFormalTraning.description,
      this.userFormalTraning.dateFrom,
      this.userFormalTraning.dateTo,
      this.temp).pipe().subscribe((traaningRes: any) => {
        if (traaningRes.success === 1) {
          this.modalController.dismiss();
        }
      });
  }
  deleteTraningHistory() {
    this.apiService.deleteTrainingHistory(this.userDetails.id, this.userFormalTraning.id).subscribe((trainRes: any) => {
      if (trainRes.success === 1) {
        this.modalController.dismiss();
      }
    });
  }

  saveEducationData() {
    if (this.userEducation.current === true) {
      this.userEducation.dateTo = this.temp;
    }
    this.userEducation.schoolName = this.utilServ.formatString(this.userEducation.schoolName);
    this.userEducation.level = this.utilServ.formatString(this.userEducation.level);
    this.userEducation.dateFrom = this.utilServ.getYYYY_MM_DD(this.userEducation.dateFrom);
    if (this.userEducation.dateTo !== '' || this.userEducation.dateTo) {
      this.userEducation.dateTo = this.utilServ.getYYYY_MM_DD(this.userEducation.dateTo);
    } else {
      this.userEducation.dateTo = this.temp;
    }

    this.apiService.saveEducationHistory(this.userEducation.id,
      this.userDetails.id,
      this.userEducation.schoolName,
      this.userEducation.level,
      this.temp,
      this.userEducation.description,
      this.userEducation.dateFrom,
      this.userEducation.dateTo,
      this.temp).pipe().subscribe((eduRes: any) => {
        if (eduRes.success === 1) {
          this.modalController.dismiss();
        }
      });
  }
  deleteEdu() {
    this.apiService.deleteEducationHistory(this.userDetails.id, this.userEducation.id).subscribe((eduRes: any) => {
      if (eduRes.success === 1) {
        this.modalController.dismiss();
      }
    });
  }

  saveAwardData() {
    this.userAwards.awardName = this.utilServ.formatString(this.userAwards.awardName);
    this.userAwards.adwardedBy = this.utilServ.formatString(this.userAwards.adwardedBy);
    this.userAwards.date = this.utilServ.getYYYY_MM_DD(this.userAwards.date);
    this.apiService.savePortfolioAward(this.userAwards.id,
      this.userDetails.id,
      this.userAwards.awardName,
      this.userAwards.adwardedBy,
      this.userAwards.date,
      this.temp).pipe().subscribe((eduRes: any) => {
        if (eduRes.success === 1) {
          this.modalController.dismiss();
        }
      });
  }
  deleteAward() {
    this.apiService.deletePortfolioAward(this.userDetails.id, this.userAwards.id).subscribe((awardRes: any) => {
      if (awardRes.success === 1) {
        this.modalController.dismiss();
      }
    });
  }

  saveHighlightsData() { }

  saveStatsData() {
    this.userStat.title = 'statistics';
    this.userStatEntries.key = this.utilServ.formatString(this.userStatEntries.key);
    this.userStatEntries.value = this.utilServ.formatString(this.userStatEntries.value);
    this.userStat.entries.push(this.userStatEntries);
    this.apiService.savePortfolioStatistics(
      this.userStat.id,
      this.userDetails.id,
      this.userStat.title,
      this.userStat.entries,
      this.temp).subscribe((statRes: any) => {
        if (statRes.success === 1) {
          this.modalController.dismiss();
        }
      });
  }
  deleteStats() {
    this.apiService.deletePortfolioStatisticsEntry(this.userStat.entries[0].id, this.userStat.id).subscribe((statRes: any) => {
      // console.log(statRes);
      if (statRes.success === 1) {
        this.modalController.dismiss();
      }
    });
  }

  saveAspirationData() {
    this.userAspiration.text = this.utilServ.formatString(this.userAspiration.text);
    this.apiService.savePortfolioAspiration(
      this.userAspiration.id,
      this.userDetails.id,
      this.userAspiration.title,
      this.userAspiration.text,
      this.temp).subscribe((aspRes: any) => {
        if (aspRes.success === 1) {
          this.modalController.dismiss();
        }
      });
  }
  deleteAsp() {
    this.apiService.deletePortfolioAspiration(this.userDetails.id, this.userAspiration.id).subscribe((aspRes: any) => {
      if (aspRes.success === 1) {
        this.modalController.dismiss();
      }
    });
  }
  getSportById(sId) {
    let xDx: any = this.utilServ.getSportsList();
    xDx = xDx.filter(d => d.id === sId);
    if (xDx[0]) {
      return xDx[0];
    }
  }
  async selectSports(x) {
    const yesOrNo = this.teamHistoryAddFlag;
    const modal = await this.modalController.create({
      component: SelectSportsOrLagacyComponent,
      componentProps: {
        data: yesOrNo
      }
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {
        const xDx = data.data.data;
        this.sports = xDx.sportsName;
        this.sportsIcon = xDx.sportsIcon;
        this.sportsId = xDx.id;
        this.positionsArray = xDx;
        if (this.userTeamHistory) {
          this.userTeamHistory.sportsName = this.sports;
          this.userTeamHistory.sportsId = this.sportsId;
          this.userTeamHistory.positionId = this.temp;
          this.userTeamHistory.positionName = this.temp;
        }
        if (this.userFormalTraning) {
          this.userFormalTraning.sportsName = this.sports;
          this.userFormalTraning.sportsId = this.sportsId;
        }
      }
    });
    return await modal.present();
  }
  async selectPosition(x) {
    const modal = await this.modalController.create({
      component: PositionForSportsComponent,
      componentProps: {
        data: this.positionsArray
      }
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.positions = data.data.data;
        this.userTeamHistory.positionId = this.positions.position.id;
        this.userTeamHistory.positionName = this.positions.position.name;
      }
    });
    return await modal.present();
  }

  exit() {
    this.modalController.dismiss();
  }
  setFocus(nextElement) {
    setTimeout(() => {
      nextElement.setFocus();
    }, 500);
  }
  markSelected(x) {
    x.isChecked = !x.isChecked;
  }
  async gotocountry() {
    const modal = await this.modalController.create({
      component: SelectCountryComponent,
    });
    modal.onDidDismiss().then(data => {
      if (data.data.data) {
        this.profileinfo.countryName = data.data.data.countryName;
        this.profileinfo.countryCode = data.data.data.countryCode;
      }
    });
    return await modal.present();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.firstNameString = this.utilServ.getLangByCode('first_name');
      this.lastNameString = this.utilServ.getLangByCode('last_name');
      this.genderString = this.utilServ.getLangByCode('gender');
      this.birthdayString = this.utilServ.getLangByCode('birthday');
      this.cityString = this.utilServ.getLangByCode('city');
      this.countryString = this.utilServ.getLangByCode('country');
      this.heightString = this.utilServ.getLangByCode('height');
      this.weightString = this.utilServ.getLangByCode('weight');
      this.dateFromString = this.utilServ.getLangByCode('from_date');
      this.dateToString = this.utilServ.getLangByCode('to_date');
      this.descriptionString = this.utilServ.getLangByCode('description');
      this.nameString = this.utilServ.getLangByCode('name');
      this.sportString = this.utilServ.getLangByCode('sports');
      this.saveString = this.utilServ.getLangByCode('save');
    }
  }
}
