import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManagerLessonComponent } from './lesson.component';

describe('ContentManagerLessonComponent', () => {
  let component: ContentManagerLessonComponent;
  let fixture: ComponentFixture<ContentManagerLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentManagerLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentManagerLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
