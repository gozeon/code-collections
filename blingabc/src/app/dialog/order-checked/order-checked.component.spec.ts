import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCheckedComponent } from './order-checked.component';

describe('OrderCheckedComponent', () => {
  let component: OrderCheckedComponent;
  let fixture: ComponentFixture<OrderCheckedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCheckedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCheckedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
