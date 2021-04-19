import { Component, OnInit } from '@angular/core';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';

@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.page.html',
  styleUrls: ['./network-error.page.scss'],
})
export class NetworkErrorPage implements OnInit {
  noInterNetString: any;

  constructor(private utilServ: GenralUtilsService) { }

  ngOnInit() {
    if (this.utilServ.langLibrary) {
      this.noInterNetString = this.utilServ.getLangByCode('no_internet');
    }
    // internet_back

    // mobile_offline
  }

}
