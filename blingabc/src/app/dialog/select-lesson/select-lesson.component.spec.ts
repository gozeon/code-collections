import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLessonComponent } from './select-lesson.component';

describe('SelectLessonComponent', () => {
  let component: SelectLessonComponent;
  let fixture: ComponentFixture<SelectLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
