import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceManagerComponent } from './customer-service-manager.component';

describe('CustomerServiceManagerComponent', () => {
  let component: CustomerServiceManagerComponent;
  let fixture: ComponentFixture<CustomerServiceManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerServiceManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
