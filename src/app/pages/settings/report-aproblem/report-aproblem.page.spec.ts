import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportAProblemPage } from './report-aproblem.page';

describe('ReportAProblemPage', () => {
  let component: ReportAProblemPage;
  let fixture: ComponentFixture<ReportAProblemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportAProblemPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportAProblemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
