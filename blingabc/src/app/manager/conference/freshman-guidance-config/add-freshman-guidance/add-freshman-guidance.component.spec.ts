import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreshmanGuidanceComponent } from './add-freshman-guidance.component';

describe('AddFreshmanGuidanceComponent', () => {
  let component: AddFreshmanGuidanceComponent;
  let fixture: ComponentFixture<AddFreshmanGuidanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFreshmanGuidanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreshmanGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
