import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscoveryPage } from './discovery.page';

describe('DiscoveryPage', () => {
  let component: DiscoveryPage;
  let fixture: ComponentFixture<DiscoveryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
