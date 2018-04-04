import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagerComponent } from './order-manager.component';

describe('OrderManagerComponent', () => {
  let component: OrderManagerComponent;
  let fixture: ComponentFixture<OrderManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
