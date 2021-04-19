import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpCenterPage } from './help-center.page';

describe('HelpCenterPage', () => {
  let component: HelpCenterPage;
  let fixture: ComponentFixture<HelpCenterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpCenterPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpCenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
