import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderVerifyComponent } from './order-verify.component';

describe('OrderVerifyComponent', () => {
  let component: OrderVerifyComponent;
  let fixture: ComponentFixture<OrderVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
