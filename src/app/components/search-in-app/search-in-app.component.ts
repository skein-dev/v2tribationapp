import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ModalController } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-search-in-app',
  templateUrl: './search-in-app.component.html',
  styleUrls: ['./search-in-app.component.scss'],
})
export class SearchInAppComponent implements OnInit {
  @ViewChild('searchBox') searchBox;

  environment;
  searchTerm = '';
  viewUserInfo: any;
  listOfUser: any;
  userListLength: any;


  // Strings

  searchString = 'search';
  noFriendsListString = 'No group or friend found';
  findFriendsGroupsString = 'Find your friends and groups';

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private router: Router,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
    this.environment = environment;
  }
  ionViewLoaded() {
    setTimeout(() => {
      this.searchBox.focus();
    }, 150);
  }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.search(this.searchTerm);
  }
  rootMsgPage(friendId) {
    this.back();
    this.utilServ.navChatwithId(friendId);
  }
  search(x) {
    if (x) {
      this.apiService.serachInApp(x).subscribe((res: any) => {
        this.viewUserInfo = res.message.users;
        this.listOfUser = this.viewUserInfo;
        this.userListLength = this.listOfUser.length;
      });
    }
  }
  friendDetail(userId) {
    this.back();
    this.router.navigate([`profile/${userId}`]);
  }

  back() {
    this.modalController.dismiss();
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.searchString = this.utilServ.getLangByCode('search');
      this.noFriendsListString = this.utilServ.getLangByCode('no_frnd_list');
      this.findFriendsGroupsString = this.utilServ.getLangByCode('search_keyword');
    }
  }
}
