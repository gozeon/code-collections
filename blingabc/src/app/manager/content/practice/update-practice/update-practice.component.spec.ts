import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePracticeComponent } from './update-practice.component';

describe('UpdatePracticeComponent', () => {
  let component: UpdatePracticeComponent;
  let fixture: ComponentFixture<UpdatePracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
