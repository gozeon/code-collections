import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateForeignTeacherComponent } from './update-foreign-teacher.component';

describe('UpdateForeignTeacherComponent', () => {
  let component: UpdateForeignTeacherComponent;
  let fixture: ComponentFixture<UpdateForeignTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateForeignTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateForeignTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
