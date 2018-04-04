import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTrackTimeComponent } from './set-track-time.component';

describe('SetTrackTimeComponent', () => {
  let component: SetTrackTimeComponent;
  let fixture: ComponentFixture<SetTrackTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetTrackTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTrackTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
