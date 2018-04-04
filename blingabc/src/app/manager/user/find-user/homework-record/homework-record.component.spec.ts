import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkRecordComponent } from './homework-record.component';

describe('HomeworkRecordComponent', () => {
  let component: HomeworkRecordComponent;
  let fixture: ComponentFixture<HomeworkRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworkRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
