import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-filter-sport-discovery',
  templateUrl: './filter-sport-discovery.component.html',
  styleUrls: ['./filter-sport-discovery.component.scss'],
})
export class FilterSportDiscoveryComponent implements OnInit {
  @ViewChild('searchBox') searchBox;

  sportData;
  environment;
  filteredSportData: any[];
  limitOfResults = 20;
  limitreached = false;
  skipFirst = 0;

  // Strings
  searchString = 'search';
  tryChangeFilterString = 'Try changing the filter or search term.';
  allCaughtUpString = 'You are All Caught Up :)';

  constructor(private navParams: NavParams,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService,
    private router: Router,
    private apiService: ApiService,
    private modalController: ModalController) {
    if (this.navParams.get('data')) {
      this.sportData = this.navParams.get('data');
      this.getFilteredSport();
    }
    this.actRouter.queryParams.subscribe(() => {
      this.filteredSportData = [];
      this.environment = environment;
      this.getLanguageStrings();
    });
  }

  ngOnInit() { }

  search(x) {
    if (x) {
      // this.apiService.serachInApp(x).subscribe((res: any) => {

      // });
    }
  }
  back() {
    this.modalController.dismiss();
  }

  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.searchString = this.utilServ.getLangByCode('search');
      this.tryChangeFilterString = this.utilServ.getLangByCode('tryChangeFilterString');
      this.allCaughtUpString = this.utilServ.getLangByCode('allCaughtUpString');
    }
  }
  loadMore(e) {
    // if (this.notificationList) {
    //   if ((this.totalNotification === this.notificationList.length) || (this.totalNotification <= this.notificationList.length)) {
    //     this.limitReached = true;
    //   } else {
    this.skipFirst += 20;
    this.getFilteredSport();
    //   }
    // }
    setTimeout(() => {
      e.target.complete();
    }, 500);
  }
  onClickDis(discoveryData) {
    this.back();
    localStorage.setItem('discoveryData', JSON.stringify(discoveryData));
    this.router.navigate([`explore/${discoveryData.post_id}`]);
  }
  getFilteredSport() {
    this.apiService.getFilteredSports(this.sportData.id, this.limitOfResults, this.skipFirst).subscribe((res: any) => {
      if (res.message.length > 0) {
        // console.log('sdcsff::::::', res);
        const temp = res.message;
        if (!this.filteredSportData) {
          this.filteredSportData = temp;
        } else {
          temp.forEach(element => {
            this.filteredSportData.push(element);
          });
        }
      } else {
        //  this.filteredSportData = res.message ;
        this.limitreached = true;
      }
    });
  }
}
