import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPracticeComponent } from './select-practice.component';

describe('SelectPracticeComponent', () => {
  let component: SelectPracticeComponent;
  let fixture: ComponentFixture<SelectPracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
