import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceConfigComponent } from './conference-config.component';

describe('ConferenceConfigComponent', () => {
  let component: ConferenceConfigComponent;
  let fixture: ComponentFixture<ConferenceConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferenceConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
