import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualRefundComponent } from './manual-refund.component';

describe('ManualRefundComponent', () => {
  let component: ManualRefundComponent;
  let fixture: ComponentFixture<ManualRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
