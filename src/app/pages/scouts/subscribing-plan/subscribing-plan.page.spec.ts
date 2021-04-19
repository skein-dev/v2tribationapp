import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubscribingPlanPage } from './subscribing-plan.page';

describe('SubscribingPlanPage', () => {
  let component: SubscribingPlanPage;
  let fixture: ComponentFixture<SubscribingPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubscribingPlanPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribingPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
