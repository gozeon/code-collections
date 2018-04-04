import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClassTeacherComponent } from './select-class-teacher.component';

describe('SelectClassTeacherComponent', () => {
  let component: SelectClassTeacherComponent;
  let fixture: ComponentFixture<SelectClassTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectClassTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectClassTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
