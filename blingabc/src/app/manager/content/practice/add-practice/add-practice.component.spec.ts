import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPracticeComponent } from './add-practice.component';

describe('AddPracticeComponent', () => {
  let component: AddPracticeComponent;
  let fixture: ComponentFixture<AddPracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
