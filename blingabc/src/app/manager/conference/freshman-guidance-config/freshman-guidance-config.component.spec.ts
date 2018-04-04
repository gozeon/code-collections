import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshmanGuidanceConfigComponent } from './freshman-guidance-config.component';

describe('FreshmanGuidanceConfigComponent', () => {
  let component: FreshmanGuidanceConfigComponent;
  let fixture: ComponentFixture<FreshmanGuidanceConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshmanGuidanceConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshmanGuidanceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
