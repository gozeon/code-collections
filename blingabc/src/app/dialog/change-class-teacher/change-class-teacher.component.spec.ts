import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeClassTeacherComponent } from './change-class-teacher.component';

describe('ChangeClassTeacherComponent', () => {
  let component: ChangeClassTeacherComponent;
  let fixture: ComponentFixture<ChangeClassTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeClassTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeClassTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
