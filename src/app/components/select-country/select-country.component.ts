import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';

@Component({
  selector: 'app-select-country',
  templateUrl: './select-country.component.html',
  styleUrls: ['./select-country.component.scss'],
})
export class SelectCountryComponent implements OnInit {

  searchTerm: any;
  countryList: any;
  listOfCountries: any;

  // Strings
  searchString = 'Search';

  constructor(
    private utilServ: GenralUtilsService,
    private actRouter: ActivatedRoute,
    private modalController: ModalController) {
    this.actRouter.queryParams.subscribe(() => {
      const init = setInterval(() => {
        this.countryList = this.utilServ.getCountryList();
        if (this.countryList) {
          this.listOfCountries = this.countryList;
          clearInterval(init);
        }
      }, 20);
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
  }

  select(a, b) {
    this.modalController.dismiss({
      dismissed: true,
      data: { countryCode: a, countryName: b }
    });
  }
  search(x) {
    this.listOfCountries = this.filter(this.countryList, x || null);
  }
  filter(items: any[], terms: string): any[] {
    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(it => {

      return it.COUNTRY_NAME.toLowerCase().includes(terms);
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

