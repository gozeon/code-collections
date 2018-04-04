import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceGrabConfigComponent } from './conference-grab-config.component';

describe('ConferenceGrabConfigComponent', () => {
  let component: ConferenceGrabConfigComponent;
  let fixture: ComponentFixture<ConferenceGrabConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferenceGrabConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceGrabConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
