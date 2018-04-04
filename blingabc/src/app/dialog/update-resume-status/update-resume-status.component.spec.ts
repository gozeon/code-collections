import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResumeStatusComponent } from './update-resume-status.component';

describe('UpdateResumeStatusComponent', () => {
  let component: UpdateResumeStatusComponent;
  let fixture: ComponentFixture<UpdateResumeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateResumeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateResumeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
