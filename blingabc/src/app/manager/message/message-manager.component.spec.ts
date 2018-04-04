import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageManagerComponent } from './message-manager.component';

describe('MessageManagerComponent', () => {
  let component: MessageManagerComponent;
  let fixture: ComponentFixture<MessageManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
