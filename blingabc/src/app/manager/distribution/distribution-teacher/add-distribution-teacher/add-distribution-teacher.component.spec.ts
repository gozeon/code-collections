import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDistributionTeacherComponent } from './add-distribution-teacher.component';

describe('AddDistributionTeacherComponent', () => {
  let component: AddDistributionTeacherComponent;
  let fixture: ComponentFixture<AddDistributionTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDistributionTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDistributionTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
