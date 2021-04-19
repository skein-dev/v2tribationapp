import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';

@Component({
  selector: 'app-scout-subscribtion-info',
  templateUrl: './scout-subscribtion-info.component.html',
  styleUrls: ['./scout-subscribtion-info.component.scss'],
})
export class ScoutSubscribtionInfoComponent implements OnInit {
  scoutsToolString = 'Scouts Tool';
  scoutFeature1 = 'All-in-One Communication Platform'
  scoutFeature2 = 'Reach out to amateur and aspiring athletes world wide.';
  scoutFeature3 = 'Connect with real-time conversation.';
  scoutFeature4a = 'Grow your business with our versatile';
  scoutFeature4b = 'scouting tools';
  freeSubsPlan = '1 Week Trial Free*';
  monthlySubsPlan = 'Monthly - $169.99 USD';
  yearSubsPlan = 'Yearly - $399.99 USD';
  yearActualSubsPlan = 'Yearly - $3,588 USD';

  constructor(
    private mc: ModalController,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService) {
    this.actRouter.queryParams.subscribe(() => {
      this.getLanguageStrings();
    });
  }

  ngOnInit() {
  }
  getLanguageStrings() {
    if (this.utilServ.langSetupFLag) {
      this.scoutsToolString = this.utilServ.getLangByCode('scout_tool');
      this.scoutFeature1 = this.utilServ.getLangByCode('scout.label.description.1');
      this.scoutFeature2 = this.utilServ.getLangByCode('scout.label.description.2');
      this.scoutFeature3 = this.utilServ.getLangByCode('scout.label.description.3');
      this.scoutFeature4a = this.utilServ.getLangByCode('scout.label.description.4a');
      this.scoutFeature4b = this.utilServ.getLangByCode('scout.label.description.4b');
      this.freeSubsPlan = this.utilServ.getLangByCode('scout.label.freeSubPlan');
      this.monthlySubsPlan = this.utilServ.getLangByCode('scout.label.monthlySubPlan');
      this.yearSubsPlan = this.utilServ.getLangByCode('scout.label.yearSubPlan');
      this.yearActualSubsPlan = this.utilServ.getLangByCode('scout.label.yearActualSubPlan');
    }
  }
  close() {
    this.mc.dismiss();
  }
}
