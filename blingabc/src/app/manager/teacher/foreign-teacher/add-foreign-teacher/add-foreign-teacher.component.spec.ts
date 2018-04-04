import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddForeignTeacherComponent } from './add-foreign-teacher.component';

describe('AddForeignTeacherComponent', () => {
  let component: AddForeignTeacherComponent;
  let fixture: ComponentFixture<AddForeignTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddForeignTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddForeignTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
