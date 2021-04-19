import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ModalController, NavParams } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-sports-or-lagacy',
  templateUrl: './select-sports-or-lagacy.component.html',
  styleUrls: ['./select-sports-or-lagacy.component.scss'],
})
export class SelectSportsOrLagacyComponent implements OnInit {

  searchTerm: any;
  sportsList: any;
  listOfSports: any;
  selectPosition = false;

  // Strings
  searchString = 'Search';

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private actRouter: ActivatedRoute,
    private navParams: NavParams,
    private utilServ: GenralUtilsService) {
    if (this.navParams.get('data')) {
      this.selectPosition = this.navParams.get('data');
    }
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.sportsList = this.utilServ.getSportsList();
    // console.table(this.sportsList);
    this.listOfSports = this.sportsList;
  }

  select(a, b, c, d) {
    if (this.selectPosition === false) {
      this.modalController.dismiss({
        dismissed: true,
        data: { id: a, sportsName: b, sportsIcon: c }
      });
    } else if (this.selectPosition === true) {
      this.modalController.dismiss({
        dismissed: true,
        data: { id: a, sportsName: b, sportsIcon: c, posotions: d }
      });
    }

  }

  search(x) {
    this.listOfSports = this.filter(this.sportsList, x || null);
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
