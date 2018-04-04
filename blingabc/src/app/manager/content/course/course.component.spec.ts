import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManagerCourseComponent } from './course.component';

describe('ContentManagerCourseComponent', () => {
  let component: ContentManagerCourseComponent;
  let fixture: ComponentFixture<ContentManagerCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentManagerCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentManagerCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
