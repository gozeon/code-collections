import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTeacherDetailComponent } from './process-teacher-detail.component';

describe('ProcessTeacherDetailComponent', () => {
  let component: ProcessTeacherDetailComponent;
  let fixture: ComponentFixture<ProcessTeacherDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessTeacherDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTeacherDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
