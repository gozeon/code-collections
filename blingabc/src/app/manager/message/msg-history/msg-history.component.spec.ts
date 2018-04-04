import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgHistoryComponent } from './msg-history.component';

describe('MsgHistoryComponent', () => {
  let component: MsgHistoryComponent;
  let fixture: ComponentFixture<MsgHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
