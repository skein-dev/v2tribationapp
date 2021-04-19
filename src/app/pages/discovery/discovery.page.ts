import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ModalController } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterSportDiscoveryComponent } from '../../components/filter-sport-discovery/filter-sport-discovery.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.page.html',
  styleUrls: ['./discovery.page.scss'],
})

export class DiscoveryPage implements OnInit {
  @ViewChild('searchBox') searchBox;

  environment;
  searchTerm = '';
  viewUserInfo: any;
  listOfUser: any;
  userListLength: any;
  userDetail;
  discoveryAssets: any = [];
  searchedAssests: any = [];
  sportsList: any = [];
  limitOfResults = 20;
  skipFirst = 0;
  limitreached = false;
  checkedsegment = 'people';


  // Strings
  discoveryString = 'Discovery';
  searchString = 'search';
  noFriendsListString = 'No group or friend found';
  //  findFriendsGroupsString = 'Find your friends and groups';
  allCaughtUpString = 'You are All Caught Up :)';
  tryChangeFilterString = 'Try changing the filter or search term.';
  peopleString = 'People';
  postString = 'Post';

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.userDetail = JSON.parse(this.utilServ.getUserDetails());
      this.getLanguageStrings();
      this.sportsList = this.utilServ.getSportsList();
      this.getAllAssets();
    });
    this.environment = environment;
  }
  ionViewLoaded() {
    setTimeout(() => {
      this.searchBox.focus();
    }, 150);
  }
  getAllAssets() {
    this.apiService.getAllAssets(this.userDetail.id, this.limitOfResults, this.skipFirst).subscribe((res: any) => {
      if (res.message.length > 0) {
        // console.log('sdcsff::::::', res);
        const temp = res.message;
        if (!this.discoveryAssets) {
          this.discoveryAssets = temp;
        } else {
          temp.forEach(element => {
            this.discoveryAssets.push(element);
          });
        }
      } else {
        this.limitreached = true;
      }
    });
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.search(this.searchTerm);
  }
  search(x) {
    if (x) {
      this.apiService.searchDiscoveryByPost(x).subscribe((res: any) => {
        this.searchedAssests = res.message;
      });
      this.apiService.serachInApp(x).subscribe((res: any) => {
        this.viewUserInfo = res.message.users;
        this.listOfUser = this.viewUserInfo;
        this.userListLength = this.listOfUser.length;
      });
    }
  }
  friendDetail(userId) {
    // this.back();
    this.router.navigate([`profile/${userId}`]);
  }
  back() {
    this.location.back();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.discoveryString = this.utilServ.getLangByCode('discoveryString'); // New
      this.noFriendsListString = this.utilServ.getLangByCode('no_frnd_list');
      this.searchString = this.utilServ.getLangByCode('search');
      this.tryChangeFilterString = this.utilServ.getLangByCode('tryChangeFilterString');
      this.allCaughtUpString = this.utilServ.getLangByCode('allCaughtUpString');
      this.peopleString = this.utilServ.getLangByCode('peopleString');
      this.postString = this.utilServ.getLangByCode('postString');
    }
  }
  async onClickSport(sport) {
    const modal = await this.modalController.create({
      component: FilterSportDiscoveryComponent,
      componentProps: {
        data: sport
      }
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {

      }
    });
    return await modal.present();

  }
  loadMore(e) {
    this.skipFirst += 20;
    this.getAllAssets();
    setTimeout(() => {
      e.target.complete();
    }, 500);
  }
  onClickDis(discoveryData) {
    localStorage.setItem('discoveryData', JSON.stringify(discoveryData));
    this.router.navigate([`explore/${discoveryData.post_id}`]);
  }
  searchByDiscChanged(ev) {
    this.checkedsegment = ev.detail.value;
  }
  rootMsgPage(friendId) {
    // this.back();
    this.utilServ.navChatwithId(friendId);
  }
}
