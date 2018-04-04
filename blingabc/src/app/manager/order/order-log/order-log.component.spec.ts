import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLogComponent } from './order-log.component';

describe('OrderLogComponent', () => {
  let component: OrderLogComponent;
  let fixture: ComponentFixture<OrderLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
