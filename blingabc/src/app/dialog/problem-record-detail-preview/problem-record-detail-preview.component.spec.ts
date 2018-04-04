import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemRecordDetailPreviewComponent } from './problem-record-detail-preview.component';

describe('ProblemRecordDetailPreviewComponent', () => {
  let component: ProblemRecordDetailPreviewComponent;
  let fixture: ComponentFixture<ProblemRecordDetailPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemRecordDetailPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemRecordDetailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
