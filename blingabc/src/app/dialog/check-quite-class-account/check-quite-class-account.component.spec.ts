import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckQuiteClassAccountComponent } from './check-quite-class-account.component';

describe('CheckQuiteClassAccountComponent', () => {
  let component: CheckQuiteClassAccountComponent;
  let fixture: ComponentFixture<CheckQuiteClassAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckQuiteClassAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckQuiteClassAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
