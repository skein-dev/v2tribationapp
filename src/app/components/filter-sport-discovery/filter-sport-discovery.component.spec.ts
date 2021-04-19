import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterSportDiscoveryComponent } from './filter-sport-discovery.component';

describe('FilterSportDiscoveryComponent', () => {
  let component: FilterSportDiscoveryComponent;
  let fixture: ComponentFixture<FilterSportDiscoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterSportDiscoveryComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSportDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
