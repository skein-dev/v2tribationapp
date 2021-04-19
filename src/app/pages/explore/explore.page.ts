import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ModalController, ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { MultimediaViewComponent } from 'src/app/components/multimedia-view/multimedia-view.component';
import { Location } from '@angular/common';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  postId;
  currentLocation;
  environment;
  limitOfResults = 20;
  skipFirst = 0;
  exploreAssests;
  limitreached = false;
  modalOpen = false;

  //String

  exploreString = 'Explore';

  constructor(
    private actRouter: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    private router: Router,
    private modalcontrolller: ModalController,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.environment = environment;
      this.getLanguageStrings();
    });
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.currentLocation = JSON.parse(localStorage.getItem('currentLocation'));
    const x: string = this.currentLocation.substr(9, this.currentLocation.length);
    this.postId = Number(x.split('/')[0]);
    this.getExploreData(this.postId);
  }

  getExploreData(postId) {
    this.apiService.getExploreAssets(postId, this.limitOfResults, this.skipFirst).subscribe((res: any) => {
      if (res.message.length > 0) {
        const temp = res.message;
        if (!this.exploreAssests) {
          this.exploreAssests = temp;
        } else {
          temp.forEach(element => {
            this.exploreAssests.push(element);
          });
        }
      } else {
        this.limitreached = true;
      }
    });
  }
  loadMore(e) {
    this.skipFirst += 20;
    this.getExploreData(this.postId);
    setTimeout(() => {
      e.target.complete();
    }, 500);
  }

  getTimeFromNow(createdDate) {
    return moment(createdDate).fromNow();
  }

  async openMultiMedia(fullAsserts, i, postType) {
    if (this.modalOpen === false) {
      this.modalOpen = true;
      const list = [{ asset_url: `${fullAsserts}`, post_type: postType, asset_type: postType }];
      const xDx = {
        asserts: list,
        currentIndex: 0
      };
      localStorage.setItem('mediaArray', JSON.stringify(xDx));
      const modal = await this.modalcontrolller.create({
        component: MultimediaViewComponent,
        componentProps: {
          swipeToClose: true
        }
      });
      modal.onDidDismiss().then((data) => {
        this.modalOpen = false;
      });
      return await modal.present();
    }
  }
  back() {
    localStorage.removeItem('discoveryData');
    this.location.back();
  }
  goToProfile(id) {
    localStorage.removeItem('discoveryData');
    this.router.navigate([`profile/${id}`]);
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.exploreString = this.utilServ.getLangByCode('exploreString');
    }
  }
}
