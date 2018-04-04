import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceInsertComponent } from './finance-insert.component';

describe('FinanceInsertComponent', () => {
  let component: FinanceInsertComponent;
  let fixture: ComponentFixture<FinanceInsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceInsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
