import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectCountryComponent } from '../select-country/select-country.component';
import { SelectSportsOrLagacyComponent } from '../select-sports-or-lagacy/select-sports-or-lagacy.component';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute } from '@angular/router';
import { PositionForSportsComponent } from '../select-sports-or-lagacy/position-for-sports/position-for-sports.component';

@Component({
  selector: 'app-scout-tool-filter',
  templateUrl: './scout-tool-filter.component.html',
  styleUrls: ['./scout-tool-filter.component.scss'],
})
export class ScoutToolFilterComponent implements OnInit {

  country;
  countryCode = null;
  city;
  gender;
  position;
  sports;
  sportsId: number = null;
  sportsIcon: any;
  heightRange: any = {
    lower: 1,
    upper: 100
  };
  minHeight = 1;
  maxHeight = 100;
  diffHeight = 2;
  heightUnit;
  weightRange: any = {
    lower: 1,
    upper: 100
  };
  minWeight = 1;
  maxWeight = 100;
  diffWeight = 2;
  weightUnit;
  expRange: any = {
    lower: 0,
    upper: 80
  };
  minExp = 0;
  maxExp = 80;
  diffExp = 1;
  ageRange: any = {
    lower: 1,
    upper: 99
  };
  minAge = 1;
  maxAge = 99;
  diffAge = 1;
  expChange = false;
  heightChange = false;
  ageChange = false;
  weightChange = false;
  haveOldData = true;
  posArray: any[] = [];
  // Strings
  genderString = 'Gender';
  maleString = 'Male';
  femaleString = 'Female';
  countryString = 'Country';
  cityString = 'City';
  sportsSting = 'Sports';
  selectCounrtyString = 'Select Country';
  enterCityString = 'Enter City';
  positionString = 'Position';
  enterPositionString = 'Enter Position ';
  selectSportString = 'Select Sports';
  heightString = 'Height';
  inchesString = 'inches';
  cmString = 'cm';
  feetString = 'feet';
  weightString = 'Weight';
  kgString = 'Kg';
  poundsString = 'Pounds';
  stonesString = 'Stones';
  filterToolsString = 'Filter Tools';
  experinceString = 'Experience';
  ageString = 'Age Range';
  maxString = 'Max';
  minString = 'Min';
  useOldFilterString = 'Last Filter';
  constructor(
    private modalController: ModalController,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
      const x = JSON.parse(localStorage.getItem('scoutFilter'));
      this.haveOldData = this.checkIfEmpty(x);
    });
  }

  ngOnInit() {
  }
  injectLastSearch() {
    const x = JSON.parse(localStorage.getItem('scoutFilter'));
    if (this.haveOldData === false) {
      if (x.ageRangeFrom) {
        this.ageRange.lower = x.ageRangeFrom;
      }
      if (x.ageRangeTo) {
        this.ageRange.upper = x.ageRangeTo;
      }
      if (x.city) {
        this.city = x.city;
      }
      if (x.country) {
        this.countryCode = x.country;
        const conTemp = this.utilServ.countryList.filter(d => d.CC_ISO === this.countryCode);
        this.country = conTemp[0].COUNTRY_NAME;
      }
      if (x.expRangeFrom) {
        this.expRange.lower = x.expRangeFrom;
      }
      if (x.expRangeTo) {
        this.expRange.upper = x.expRangeTo;
      }
      if (x.gender) {
        this.gender = x.gender;
      }
      if (x.heightRangeFrom) {
        this.heightRange.lower = x.heightRangeFrom;
      }
      if (x.heightRangeTo) {
        this.heightRange.upper = x.heightRangeTo;
      }
      if (x.heightUnit) {
        this.heightUnit = x.heightUnit;
      }
      if (x.position) {
        this.position = x.position;
      }
      if (x.sports) {
        this.sportsId = x.sports;
        // console.log(this.utilServ.sportsList);
        const sportTemp = this.utilServ.sportsList.filter(d => d.id === this.sportsId);
        this.sports = sportTemp[0].name;
        this.sportsIcon = sportTemp[0].icon_class;
        this.posArray = sportTemp[0].categories;
      }
      if (x.weightRangeFrom) {
        this.weightRange.lower = x.weightRangeFrom;
      }
      if (x.weightRangeTo) {
        this.weightRange.upper = x.weightRangeTo;
      }
      if (x.weightUnit) {
        this.weightUnit = x.weightUnit;
      }
    }
  }

  checkIfEmpty(obj) {
    for (let key in obj) {
      if (obj[key] !== null && obj[key] !== '') {
        return false;
      }
    }
    return true;
  }

  ionViewDidEnter() {
    this.setupBasic();
  }
  ionViewDidLeave() {
    // this.reset();
  }
  setupBasic() {
    this.heightUnit = 'in';
    this.weightUnit = 'pounds';
    // this.weightRange.lower = 0;
    // this.weightRange.upper = 100;
    // this.heightRange.lower = 0;
    // this.heightRange.upper = 100;
    this.ageRange.lower = 1;
    this.ageRange.upper = 99;
    this.minAge = 1;
    this.maxAge = 99;
    this.diffAge = 1;

    this.expRange.lower = 1;
    this.expRange.upper = 80;
    this.minExp = 0;
    this.maxExp = 80;
    this.diffExp = 1;
    this.setWeightRange();
    this.setHeightRange();
    this.reset();
  }
  weightRangeChanged() {
    this.weightChange = true;
  }
  changeWeight(x) {
    this.weightRange = {
      lower: Number(x.lower),
      upper: Number(x.upper)
    };
  }
  setWeightRange() {
    switch (this.weightUnit) {
      case 'kg':
        {
          this.minWeight = 20;
          this.maxWeight = 140;
          this.diffWeight = 5;
          break;
        }
      case 'pounds':
        {
          this.minWeight = 20;
          this.maxWeight = 300;
          this.diffWeight = 10;
          break;
        }
      case 'stones':
        {
          this.minWeight = 2;
          this.maxWeight = 30;
          this.diffWeight = 2;
          break;
        }
    }
    this.weightRange = {
      lower: Number(this.minWeight),
      upper: Number(this.maxWeight)
    };
  }

  heightRangeChanged() {
    this.heightChange = true;
  }
  changeHeight(x) {
    this.heightRange = {
      lower: Number(x.lower),
      upper: Number(x.upper)
    };
  }
  setHeightRange() {
    switch (this.heightUnit) {
      case 'in':
        {
          this.minHeight = 2;
          this.maxHeight = 200;
          this.diffHeight = 5;
          break;
        }
      case 'cm':
        {
          this.minHeight = 80;
          this.maxHeight = 250;
          this.diffHeight = 5;
          break;
        }
      case 'feet':
        {
          this.minHeight = 3;
          this.maxHeight = 10;
          this.diffHeight = 1;
          break;
        }
    }
    this.heightRange = {
      lower: Number(this.minHeight),
      upper: Number(this.maxHeight)
    };
  }

  changeExp(x) {
    // console.log('changing Exp');
    this.expChange = true;
    this.expRange = {
      lower: Number(x.lower),
      upper: Number(x.upper)
    };
  }
  changeAge(x) {
    // console.log('changing Age');
    this.ageChange = true;
    this.ageRange = {
      lower: Number(x.lower) || 0,
      upper: Number(x.upper) || 0
    };
  }

  async selectCountry() {
    const modal = await this.modalController.create({
      component: SelectCountryComponent,
    });

    modal.onDidDismiss().then(data => {
      const xDx = data.data.data;
      this.country = xDx.countryName;
      this.countryCode = xDx.countryCode;
    });
    return await modal.present();
  }
  async selectSports() {
    const modal = await this.modalController.create({
      component: SelectSportsOrLagacyComponent,
      componentProps: {
        data: true
      }
    });

    modal.onDidDismiss().then(data => {
      const xDx = data.data.data;
      this.sports = xDx.sportsName;
      this.sportsIcon = xDx.sportsIcon;
      this.sportsId = xDx.id;
      this.posArray = xDx;
    });
    return await modal.present();
  }
  async selectPosition() {
    const modal = await this.modalController.create({
      component: PositionForSportsComponent,
      componentProps: {
        data: this.posArray
      }
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.position = data.data.data.position.name;

      }
    });
    return await modal.present();
  }
  reset() {
    this.gender = null;
    this.country = null;
    this.countryCode = null;
    this.city = null;
    this.sports = null;
    this.sportsIcon = null;
    this.position = null;

    this.heightRange.lower = 1;
    this.heightRange.upper = 100;
    this.minHeight = 1;
    this.maxHeight = 100;
    this.diffHeight = 2;
    this.heightUnit = 'in';

    this.weightRange.lower = 1;
    this.weightRange.upper = 100;
    this.minWeight = 1;
    this.maxWeight = 100;
    this.diffWeight = 2;
    this.weightUnit = 'pounds';

    this.expRange.lower = 0;
    this.expRange.upper = 80;
    this.minExp = 0;
    this.maxExp = 80;
    this.diffExp = 1;

    this.ageRange.lower = 1;
    this.ageRange.upper = 99;
    this.minAge = 1;
    this.maxAge = 99;
    this.diffAge = 1;

    this.expChange = false;
    this.heightChange = false;
    this.ageChange = false;
    this.weightChange = false;
    this.sportsId = null;
  }
  save() {
    let x = {
      expRangeFrom: null,
      expRangeTo: null,
      ageRangeFrom: null,
      ageRangeTo: null,
      heightRangeFrom: null,
      heightRangeTo: null,
      weightRangeFrom: null,
      weightRangeTo: null,
      gender: this.gender,
      sports: this.sportsId,
      position: this.position,
      country: this.countryCode,
      city: this.city,
      weightUnit: null,
      heightUnit: null
    };

    if (this.expChange === true) {
      x.expRangeFrom = this.expRange.lower;
      x.expRangeTo = this.expRange.upper;
    }
    if (this.ageChange === true) {
      x.ageRangeFrom = this.ageRange.lower;
      x.ageRangeTo = this.ageRange.upper;
    }
    if (this.heightChange === true) {
      x.heightUnit = this.heightUnit;
      x.heightRangeFrom = this.heightRange.lower;
      x.heightRangeTo = this.heightRange.upper;
    }
    if (this.weightChange === true) {
      x.weightUnit = this.weightUnit;
      x.weightRangeFrom = this.weightRange.lower;
      x.weightRangeTo = this.weightRange.upper;
    }
    // console.log(' :: From Comp scout :: ');
    // console.table(x);

    // console.log('expChange', this.expChange);
    // console.log('heightChange', this.heightChange);
    // console.log('ageChange', this.ageChange);
    // console.log('weightChange', this.weightChange);
    localStorage.setItem('scoutFilter', JSON.stringify(x));
    this.modalController.dismiss({
      dismissed: true,
      data: x
    });
    // this.reset();

  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }
  exitFocus() {
    this.utilServ.exitKeyBoard();
  }
  back() {
    this.modalController.dismiss({
      dismissed: true,
      data: null
    });
    // this.reset();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {

      this.genderString = this.utilServ.getLangByCode('gender');
      this.maleString = this.utilServ.getLangByCode('male');
      this.femaleString = this.utilServ.getLangByCode('female');
      this.countryString = this.utilServ.getLangByCode('country');
      this.cityString = this.utilServ.getLangByCode('city');
      this.sportsSting = this.utilServ.getLangByCode('sport');
      this.selectCounrtyString = this.utilServ.getLangByCode('select_country');
      this.enterCityString = this.utilServ.getLangByCode('enter_city_name');
      this.positionString = this.utilServ.getLangByCode('position');
      this.enterPositionString = this.utilServ.getLangByCode('enter_position');
      this.selectSportString = this.utilServ.getLangByCode('select_sport');
      this.heightString = this.utilServ.getLangByCode('height');
      this.inchesString = this.utilServ.getLangByCode('inches');
      this.cmString = this.utilServ.getLangByCode('cm');
      this.feetString = this.utilServ.getLangByCode('feet');
      this.weightString = this.utilServ.getLangByCode('weight');
      this.kgString = this.utilServ.getLangByCode('kg');
      this.poundsString = this.utilServ.getLangByCode('pounds');
      this.stonesString = this.utilServ.getLangByCode('stones');
      this.filterToolsString = this.utilServ.getLangByCode('filterToolsString');
      this.experinceString = this.utilServ.getLangByCode('expString');
      this.ageString = this.utilServ.getLangByCode('age_range');
      this.minString = this.utilServ.getLangByCode('min');
      this.maxString = this.utilServ.getLangByCode('max');
    }
  }
}
