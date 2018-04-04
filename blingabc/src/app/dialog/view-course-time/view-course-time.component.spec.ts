import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCourseTimeComponent } from './view-course-time.component';

describe('ViewCourseTimeComponent', () => {
  let component: ViewCourseTimeComponent;
  let fixture: ComponentFixture<ViewCourseTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCourseTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCourseTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
