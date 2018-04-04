import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDistributionWithdrawProhibitedComponent } from './add-distribution-withdraw-prohibited.component';

describe('AddDistributionWithdrawProhibitedComponent', () => {
  let component: AddDistributionWithdrawProhibitedComponent;
  let fixture: ComponentFixture<AddDistributionWithdrawProhibitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDistributionWithdrawProhibitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDistributionWithdrawProhibitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
