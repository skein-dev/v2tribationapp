import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScoutsPage } from './scouts.page';

describe('ScoutsPage', () => {
  let component: ScoutsPage;
  let fixture: ComponentFixture<ScoutsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScoutsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
