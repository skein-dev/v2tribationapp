import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { GenralUtilsService } from 'src/app/services/genral-utils.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {
  @ViewChild('lastNameInputBox') lastNameInputBox: any;
  @ViewChild('firstNameInputBox') firstNameInputBox: any;

  loaderToShow: Promise<void>;
  ifEdited = false;
  // Basic User Details
  userDetail;
  profileImageURL;
  profileFirstname;
  profileLastName;
  profilePicUrl;
  profileId;
  profileEmailId;
  profileCity;
  environment;

  editLastName;
  editFirstName;
  editedLastName;
  editedFirstName;

  // Strings
  updateString = 'Update';
  lastNameString = 'Last Name';
  firstNameString = 'First Name';
  emailString = 'Email';
  editProfileString = 'Edit profile';
  constructor(
    private location: Location,
    private apiService: ApiService,
    private actRouter: ActivatedRoute,
    private utilServ: GenralUtilsService,) {
    this.actRouter.queryParams.subscribe(() => {
      this.setupBasicDetails();
      this.editFirstName = false;
      this.editLastName = false;
      this.ifEdited = (this.editFirstName || this.editLastName);
    });
  }

  ngOnInit() {
    this.environment = environment;
    this.setupBasicDetails();
  }
  ionViewWillEnter() {
    this.utilServ.setUpUser();
  }

  setupBasicDetails() {
    this.userDetail = JSON.parse(this.utilServ.getUserDetails());
    this.utilServ.checkUserExists();
    // this.countryName = (this.userDetail.country_code);
    this.profileId = this.userDetail.id;
    this.profileImageURL = this.userDetail.profile_img_url;
    this.profileFirstname = this.userDetail.first_name;
    this.profileLastName = this.userDetail.last_name;
    this.profileCity = this.userDetail.city;
    this.profileEmailId = this.userDetail.email;

    if (this.utilServ.langSetupFLag) {
      this.updateString = this.utilServ.getLangByCode('update');
      this.lastNameString = this.utilServ.getLangByCode('last_name');
      this.firstNameString = this.utilServ.getLangByCode('first_name');
      this.emailString = this.utilServ.getLangByCode('email');
      this.editProfileString = this.utilServ.getLangByCode('edit_profile');
    } else {
      this.utilServ.checkBasicElseRelodApp();
    }

  }

  editFirstNameFun() {
    setTimeout(() => { this.firstNameInputBox.setFocus(); }, 10);
    this.editFirstName = true;
    this.ifEdited = (this.editFirstName || this.editLastName);

  }
  editLastNameFun() {
    setTimeout(() => { this.lastNameInputBox.setFocus(); }, 10);
    this.editLastName = true;
    this.ifEdited = (this.editFirstName || this.editLastName);
  }

  reset(that) {
    switch (that) {
      case 'lName': {
        this.editLastName = false;
        this.profileLastName = this.editedLastName;
        break;
      }

      case 'fName': {
        this.editFirstName = false;
        this.profileFirstname = this.editedFirstName;
        break;
      }
    }
  }

  update(newFname, newLname) {
    this.apiService.editProfileInfo(this.profileId, newFname, newLname).pipe().subscribe((res: any) => {
      if (res.success === 1) {
        // console.log(res);
        this.userDetail = JSON.parse(localStorage.getItem('userdetail'));
        this.utilServ.userDetail = null;
        this.userDetail.first_name = this.profileFirstname;
        this.userDetail.last_name = this.profileLastName;
        localStorage.setItem('userdetail', JSON.stringify(this.userDetail));
        this.utilServ.setUpUser();
      }
    });
    this.utilServ.showLoaderWait();
    setTimeout(() => {
      this.utilServ.hideLoaderWait();
      this.back();
    }, 1500);
  }

  back() {
    this.location.back();
  }
}
