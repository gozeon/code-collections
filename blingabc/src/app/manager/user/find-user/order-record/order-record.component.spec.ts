import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRecordComponent } from './order-record.component';

describe('OrderRecordComponent', () => {
  let component: OrderRecordComponent;
  let fixture: ComponentFixture<OrderRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
