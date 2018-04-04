import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTrackContentComponent } from './show-track-content.component';

describe('ShowTrackContentComponent', () => {
  let component: ShowTrackContentComponent;
  let fixture: ComponentFixture<ShowTrackContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTrackContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTrackContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
