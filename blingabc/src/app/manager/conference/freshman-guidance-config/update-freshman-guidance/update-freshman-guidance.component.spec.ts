import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFreshmanGuidanceComponent } from './update-freshman-guidance.component';

describe('UpdateFreshmanGuidanceComponent', () => {
  let component: UpdateFreshmanGuidanceComponent;
  let fixture: ComponentFixture<UpdateFreshmanGuidanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFreshmanGuidanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFreshmanGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
