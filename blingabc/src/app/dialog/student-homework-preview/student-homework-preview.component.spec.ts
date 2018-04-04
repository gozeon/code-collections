import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHomeworkPreviewComponent } from './student-homework-preview.component';

describe('StudentHomeworkPreviewComponent', () => {
  let component: StudentHomeworkPreviewComponent;
  let fixture: ComponentFixture<StudentHomeworkPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentHomeworkPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHomeworkPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
