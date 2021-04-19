import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgetPassPage } from './forget-pass.page';

describe('ForgetPassPage', () => {
  let component: ForgetPassPage;
  let fixture: ComponentFixture<ForgetPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetPassPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
