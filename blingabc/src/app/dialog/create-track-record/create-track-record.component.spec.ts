import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrackRecordComponent } from './create-track-record.component';

describe('CreateTrackRecordComponent', () => {
  let component: CreateTrackRecordComponent;
  let fixture: ComponentFixture<CreateTrackRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrackRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrackRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
