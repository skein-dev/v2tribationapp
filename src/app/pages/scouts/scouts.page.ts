import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from '../../../environments/environment';
import { ModalController } from '@ionic/angular';
import { ScoutToolFilterComponent } from 'src/app/components/scout-tool-filter/scout-tool-filter.component';

@Component({
  selector: 'app-scouts',
  templateUrl: './scouts.page.html',
  styleUrls: ['./scouts.page.scss'],
})
export class ScoutsPage implements OnInit {
  // Prospect Filters
  experienceDateFrom: number;
  experienceDateTo: number;
  ageOfPlayersFrom: number;
  ageOfPlayersTo: number;
  hightFrom: number;
  hightTo: number;
  weightFrom: number;
  weightTo: number;
  playerGender: string;
  sportsId: number[] = [];
  playerPostion: string;
  countryCode: string;
  cityOfPlayer: string;
  weightUnit: string;
  heightUnit: string;
  orderBy: string;
  sortOrder: string;
  limitOfResults = 20;
  skipFirst = 0;
  totalPros: any;
  limitReached = false;
  nothingToShow = false;
  countryData: any;
  sportsData: any;
  clearSorting = true;
  expFilter = false;
  expSortVal = 'dec';
  ageFilter = false;
  ageSortVal = 'dec';
  heightFilter = false;
  heightSortVal = 'dec';
  weightFilter = false;
  weightSortVal = 'dec';
  clickedonChat = false;

  // Var's
  prospectsList: any[] = [];
  environment;
  userDetail;
  scoutStatus = false;


  // Strings
  scoutsToolString = 'Scout Tool';
  endOfSearchResultString = 'End of search results';
  noProspectString = 'No Prospects avilable with your selected filters';
  atString = 'At';
  yearsString = 'Years';
  expString = 'Exp';
  sexString = 'Sex';
  heightString = 'Height';
  weightString = 'Weight';
  cmString = 'cm';
  inchesString = 'inches';
  feetString = 'feet';
  kgString = 'Kg';
  poundsString = 'Pounds';
  stonesString = 'Stones';
  clearString = 'Clear';
  ageString = 'Age';

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private apiService: ApiService,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.clickedonChat = false;

      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.scoutStatus = this.utilServ.getScoutStatus();
      if (this.scoutStatus === false) {
        this.router.navigate(['/scouts/doc-to-upload']);
      } else {
        this.sportsData = this.utilServ.getSportsList();
        this.countryData = this.utilServ.getCountryList();
      }
      this.getLanguageStrings();
    });
  }


  ngOnInit() {
    this.prospectsList = [];
    this.environment = environment;

    this.setupBasic();
  }
  setupBasic() {
    let sport;
    if (this.sportsId.length > 0) {
      sport = this.sportsId;
    }
    this.apiService.getProspectList_Filtered(this.experienceDateFrom,
      this.experienceDateTo,
      this.ageOfPlayersFrom,
      this.ageOfPlayersTo,
      this.hightFrom,
      this.hightTo,
      this.weightFrom,
      this.weightTo,
      this.playerGender,
      sport,
      this.playerPostion,
      this.countryCode,
      this.cityOfPlayer,
      this.weightUnit,
      this.heightUnit,
      this.orderBy,
      this.sortOrder,
      this.limitOfResults,
      this.skipFirst).subscribe((res: any) => {
        // console.log('hjdsvafhsdvvfsdvfhdsavfasdv');
        if (res.success === 1) {
          this.totalPros = res.message.meta.total;
          if (this.prospectsList.length > 0) {
            const temp = res.message.content;
            temp.forEach(e => {
              this.prospectsList.push(e);
            });
          } else if (this.prospectsList.length === 0) {
            this.prospectsList = res.message.content;
          }
          if (this.prospectsList.length > 0) {
            this.prospectsList.forEach(ele => {
              // ele.height = 2.9;
              // ele.height_unit = 'cm';
              // ele.weight = 2.9;
              // ele.weight_unit = 'feet';
              if (ele.age) {
                ele.age = Number(ele.age);
              }
              if (ele.latestTeam) {
                const xDx = this.sportsData.filter(d => d.id === Number(ele.latestTeam.sport_id));
                ele.sports = xDx[0].name;
                ele.sportsIconClass = xDx[0].icon_class;
              }
              if (ele.country_code) {
                const xDx = this.countryData.filter(d => d.CC_ISO === ele.country_code);
                if (xDx[0]) {
                  ele.country = xDx[0].COUNTRY_NAME;
                }
              }
              // ele.experience = 10;
            });
          }
          // console.log(this.prospectsList);
          if (this.totalPros === 0) {
            this.nothingToShow = true;
          } else {
            this.nothingToShow = false;
          }
        }
      });
  }

  async filter() {
    const modal = await this.modalController.create({
      component: ScoutToolFilterComponent,
      componentProps: {
        // custom_data: ScoutId,
        type: 'team'
      }
    });
    modal.onDidDismiss().then((filterRes) => {

      if (filterRes.data.data) {
        const x = filterRes.data.data;
        this.ageOfPlayersFrom = x.ageRangeFrom;
        this.ageOfPlayersTo = x.ageRangeTo;
        this.cityOfPlayer = x.city;
        this.countryCode = x.country;
        this.experienceDateFrom = x.expRangeFrom;
        this.experienceDateTo = x.expRangeTo;
        this.playerGender = x.gender;
        this.hightFrom = x.heightRangeFrom;
        this.hightTo = x.heightRangeTo;
        this.heightUnit = x.heightUnit;
        this.playerPostion = x.position;
        if (x.sports) {
          this.sportsId.push(x.sports);
        }
        this.weightFrom = x.weightRangeFrom;
        this.weightTo = x.weightRangeTo;
        this.weightUnit = x.weightUnit;
        this.setupBasic();
      } else {
        this.reset();
        this.setupBasic();
      }
    });
    return await modal.present().then(() => {
      this.reset();
    });
  }
  reset() {
    this.experienceDateFrom = null;
    this.experienceDateTo = null;
    this.ageOfPlayersFrom = null;
    this.ageOfPlayersTo = null;
    this.hightFrom = null;
    this.hightTo = null;
    this.weightFrom = null;
    this.weightTo = null;
    this.playerGender = null;
    this.sportsId.length = 0;
    this.sportsId = [];
    this.playerPostion = null;
    this.countryCode = null;
    this.cityOfPlayer = null;
    this.weightUnit = null;
    this.heightUnit = null;
    this.orderBy = null;
    this.sortOrder = null;
    this.skipFirst = 0;
    this.limitReached = false;
    this.totalPros = 0;
    this.prospectsList = [];
    // console.log(this.sportsId);
  }
  loadMore(e) {
    if (this.prospectsList) {
      if (this.totalPros === this.prospectsList.length) {
        this.limitReached = true;
      } else {
        this.skipFirst += 20;
        this.setupBasic();
        if (this.clearSorting === false) {
          if (this.expFilter === true) {
            setTimeout(() => {
              this.expSort();
            }, 1000);
          } else if (this.ageFilter === true) {
            setTimeout(() => {
              this.ageSort();
            }, 1000);
          } else if (this.heightFilter === true) {
            setTimeout(() => {
              this.heightSort();
            }, 1000);
          } else if (this.weightFilter === true) {
            setTimeout(() => {
              this.weightSort();
            }, 1000);
          }
        }
      }
    }
    setTimeout(() => {
      e.target.complete();
    }, 1000);
  }
  sendChat(x) {
    this.clickedonChat = true;
    this.utilServ.navChatwithId(x);
  }
  clearStoringFun() {
    this.clearSorting = true;
    this.expFilter = false;
    this.ageFilter = false;
    this.heightFilter = false;
    this.weightFilter = false;
    this.prospectsList.sort((a, b) => {
      const bandA = a.first_name.toLowerCase();
      const bandB = b.first_name.toLowerCase();
      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    });
  }

  expSort() {
    this.clearStoringFun();
    this.clearSorting = false;
    this.expFilter = true;
    if (this.expSortVal === 'asc') {
      this.expSortVal = 'dec';
      this.prospectsList.sort((a, b) => {
        const bandA = a.experienceInDays;
        const bandB = b.experienceInDays;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
      });
    } else {
      this.expSortVal = 'asc';
      this.prospectsList.sort((a, b) => {
        const bandA = a.experienceInDays;
        const bandB = b.experienceInDays;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = -1;
        } else if (bandA < bandB) {
          comparison = 1;
        }
        return comparison;
      });
    }
  }
  ageSort() {
    this.clearStoringFun();
    this.clearSorting = false;
    this.ageFilter = true;
    if (this.ageSortVal === 'asc') {
      this.prospectsList.sort((a, b) => {
        const bandA = a.age;
        const bandB = b.age;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = -1;
        } else if (bandA < bandB) {
          comparison = 1;
        }
        return comparison;
      });
      this.ageSortVal = 'dec';
    } else {
      this.prospectsList.sort((a, b) => {
        const bandA = a.age;
        const bandB = b.age;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
      });
      this.ageSortVal = 'asc';
    }
  }
  heightSort() {
    this.clearStoringFun();
    this.clearSorting = false;
    this.heightFilter = true;
    if (this.heightSortVal === 'asc') {
      this.heightSortVal = 'dec';
      this.prospectsList.sort((a, b) => {
        const bandA = a.height;
        const bandB = b.height;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = -1;
        } else if (bandA < bandB) {
          comparison = 1;
        }
        return comparison;
      });
    } else {
      this.heightSortVal = 'asc';
      this.prospectsList.sort((a, b) => {
        const bandA = a.height;
        const bandB = b.height;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
      });
    }
  }
  weightSort() {
    this.clearStoringFun();
    this.clearSorting = false;
    this.weightFilter = true;
    if (this.weightSortVal === 'asc') {
      this.weightSortVal = 'dec';
      this.prospectsList.sort((a, b) => {
        const bandA = a.weight;
        const bandB = b.weight;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = -1;
        } else if (bandA < bandB) {
          comparison = 1;
        }
        return comparison;
      });
    } else {
      this.weightSortVal = 'asc';
      this.prospectsList.sort((a, b) => {
        const bandA = a.weight;
        const bandB = b.weight;
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
      });
    }
  }
  openPortfolio(p) {
    if (this.clickedonChat === false) {
      this.router.navigate([`/profile/${p.id}/portfolio`]);
    }
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.scoutsToolString = this.utilServ.getLangByCode('scout_tool');
      this.endOfSearchResultString = this.utilServ.getLangByCode('endOfSearchResultString');
      this.noProspectString = this.utilServ.getLangByCode('noProspectString');
      this.atString = this.utilServ.getLangByCode('atStiing');
      this.yearsString = this.utilServ.getLangByCode('yearsString');
      this.expString = this.utilServ.getLangByCode('expString');
      this.heightString = this.utilServ.getLangByCode('height');
      this.weightString = this.utilServ.getLangByCode('weight');
      this.cmString = this.utilServ.getLangByCode('cm');
      this.inchesString = this.utilServ.getLangByCode('inches');
      this.feetString = this.utilServ.getLangByCode('feet');
      this.kgString = this.utilServ.getLangByCode('kg');
      this.poundsString = this.utilServ.getLangByCode('pounds');
      this.stonesString = this.utilServ.getLangByCode('stones');
      this.clearString = this.utilServ.getLangByCode('clearString');
      this.ageString = this.utilServ.getLangByCode('age');
    }
  }
}
