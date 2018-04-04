import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCheckComponent } from './order-check.component';

describe('OrderCheckComponent', () => {
  let component: OrderCheckComponent;
  let fixture: ComponentFixture<OrderCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
