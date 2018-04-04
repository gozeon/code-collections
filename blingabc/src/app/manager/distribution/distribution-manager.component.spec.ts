import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionManagerComponent } from './distribution-manager.component';

describe('DistributionManagerComponent', () => {
  let component: DistributionManagerComponent;
  let fixture: ComponentFixture<DistributionManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
