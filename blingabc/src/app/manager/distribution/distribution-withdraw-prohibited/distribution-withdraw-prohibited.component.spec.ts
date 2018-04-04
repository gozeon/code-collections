import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionWithdrawProhibitedComponent } from './distribution-withdraw-prohibited.component';

describe('DistributionWithdrawProhibitedComponent', () => {
  let component: DistributionWithdrawProhibitedComponent;
  let fixture: ComponentFixture<DistributionWithdrawProhibitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionWithdrawProhibitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionWithdrawProhibitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
