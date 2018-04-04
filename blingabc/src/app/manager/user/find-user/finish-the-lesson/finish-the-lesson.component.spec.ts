import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishTheLessonComponent } from './finish-the-lesson.component';

describe('FinishTheLessonComponent', () => {
  let component: FinishTheLessonComponent;
  let fixture: ComponentFixture<FinishTheLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishTheLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishTheLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
