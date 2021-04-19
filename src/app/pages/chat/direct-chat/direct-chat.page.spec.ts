import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DirectChatPage } from './direct-chat.page';

describe('DirectChatPage', () => {
  let component: DirectChatPage;
  let fixture: ComponentFixture<DirectChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DirectChatPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
