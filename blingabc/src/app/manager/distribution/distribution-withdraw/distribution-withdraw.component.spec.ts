import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionWithdrawComponent } from './distribution-withdraw.component';

describe('DistributionWithdrawComponent', () => {
  let component: DistributionWithdrawComponent;
  let fixture: ComponentFixture<DistributionWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
