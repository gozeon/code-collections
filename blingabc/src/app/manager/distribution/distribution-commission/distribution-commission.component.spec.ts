import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionCommissionComponent } from './distribution-commission.component';

describe('DistributionCommissionComponent', () => {
  let component: DistributionCommissionComponent;
  let fixture: ComponentFixture<DistributionCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
