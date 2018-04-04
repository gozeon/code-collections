import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeForeignTeacherComponent } from './change-foreign-teacher.component';

describe('ChangeForeignTeacherComponent', () => {
  let component: ChangeForeignTeacherComponent;
  let fixture: ComponentFixture<ChangeForeignTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeForeignTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeForeignTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
