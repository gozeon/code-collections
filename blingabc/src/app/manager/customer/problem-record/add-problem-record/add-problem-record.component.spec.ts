import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProblemRecordComponent } from './add-problem-record.component';

describe('AddProblemRecordComponent', () => {
  let component: AddProblemRecordComponent;
  let fixture: ComponentFixture<AddProblemRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProblemRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProblemRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
