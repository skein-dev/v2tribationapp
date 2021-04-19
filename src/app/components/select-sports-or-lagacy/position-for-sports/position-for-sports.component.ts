import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-position-for-sports',
  templateUrl: './position-for-sports.component.html',
  styleUrls: ['./position-for-sports.component.scss'],
})
export class PositionForSportsComponent implements OnInit {
  searchTerm: any;
  positionsList: any;
  listOfPostions: any;
  sportData: any;

  // Strings
  searchString = 'Search';

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private navParams: NavParams,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    if (this.navParams.get('data')) {
      this.sportData = this.navParams.get('data');
      let x: any;
      if (this.sportData.name) {
        x = {
          sportsIcon: this.sportData.icon_class,
          sportsName: this.sportData.name,
          id: this.sportData.id,
          posotions: this.sportData.categories
        };
        this.sportData = x;
      }
      // console.log('positions.sportData', this.sportData);
    }
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.positionsList = this.sportData.posotions;
    // console.table(this.positionsList);
    this.listOfPostions = this.positionsList;
  }

  select(x) {
    const dataX = {
      sportId: this.sportData.id,
      sportsName: this.sportData.sportsName,
      sportsIcon: this.sportData.sportsIcon,
      position: x,
    };
    this.modalController.dismiss({
      dismissed: true,
      data: dataX
    });
  }

  search(x) {
    this.listOfPostions = this.filter(this.positionsList, x || null);
  }

  filter(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(terms);
    });
  }

  back() {
    this.modalController.dismiss({
      dismissed: true,
      data: null
    });
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.searchString = this.utilServ.getLangByCode('search');
    }
  }
}
