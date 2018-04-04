import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchImportComponent } from './batch-import.component';

describe('BatchImportComponent', () => {
  let component: BatchImportComponent;
  let fixture: ComponentFixture<BatchImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
