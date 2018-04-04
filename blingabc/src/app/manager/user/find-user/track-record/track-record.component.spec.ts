import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackRecordComponent } from './track-record.component';

describe('TrackRecordComponent', () => {
  let component: TrackRecordComponent;
  let fixture: ComponentFixture<TrackRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
