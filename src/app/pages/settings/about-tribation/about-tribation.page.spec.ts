import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutTribationPage } from './about-tribation.page';

describe('AboutTribationPage', () => {
  let component: AboutTribationPage;
  let fixture: ComponentFixture<AboutTribationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutTribationPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTribationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
