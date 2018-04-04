import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemRecordComponent } from './problem-record.component';

describe('ProblemRecordComponent', () => {
  let component: ProblemRecordComponent;
  let fixture: ComponentFixture<ProblemRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
