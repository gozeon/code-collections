import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProblemRecordComponent } from './update-problem-record.component';

describe('UpdateProblemRecordComponent', () => {
  let component: UpdateProblemRecordComponent;
  let fixture: ComponentFixture<UpdateProblemRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateProblemRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProblemRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
