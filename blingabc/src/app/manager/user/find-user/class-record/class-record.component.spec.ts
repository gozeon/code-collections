import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRecordComponent } from './class-record.component';

describe('ClassRecordComponent', () => {
  let component: ClassRecordComponent;
  let fixture: ComponentFixture<ClassRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
