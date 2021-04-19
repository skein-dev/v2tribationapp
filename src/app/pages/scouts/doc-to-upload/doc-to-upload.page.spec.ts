import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocToUploadPage } from './doc-to-upload.page';

describe('DocToUploadPage', () => {
  let component: DocToUploadPage;
  let fixture: ComponentFixture<DocToUploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocToUploadPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocToUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
