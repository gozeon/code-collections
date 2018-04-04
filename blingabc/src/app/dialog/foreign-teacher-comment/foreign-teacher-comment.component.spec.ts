import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignTeacherCommentComponent } from './foreign-teacher-comment.component';

describe('ForeignTeacherCommentComponent', () => {
  let component: ForeignTeacherCommentComponent;
  let fixture: ComponentFixture<ForeignTeacherCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignTeacherCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignTeacherCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
