import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrivacySettingPage } from './privacy-setting.page';

describe('PrivacySettingPage', () => {
  let component: PrivacySettingPage;
  let fixture: ComponentFixture<PrivacySettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacySettingPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacySettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
