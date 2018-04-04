import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPrepComponent } from './select-prep.component';

describe('SelectPrepComponent', () => {
  let component: SelectPrepComponent;
  let fixture: ComponentFixture<SelectPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
