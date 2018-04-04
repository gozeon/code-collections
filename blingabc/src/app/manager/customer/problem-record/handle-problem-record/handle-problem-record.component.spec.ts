import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleProblemRecordComponent } from './handle-problem-record.component';

describe('HandleProblemRecordComponent', () => {
  let component: HandleProblemRecordComponent;
  let fixture: ComponentFixture<HandleProblemRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandleProblemRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleProblemRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
