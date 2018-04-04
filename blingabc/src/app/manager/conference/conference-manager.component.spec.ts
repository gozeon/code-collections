import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceManagerComponent } from './conference-manager.component';

describe('ConferenceManagerComponent', () => {
  let component: ConferenceManagerComponent;
  let fixture: ComponentFixture<ConferenceManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferenceManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
