import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrderClassComponent } from './select-order-class.component';

describe('SelectOrderClassComponent', () => {
  let component: SelectOrderClassComponent;
  let fixture: ComponentFixture<SelectOrderClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOrderClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrderClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
