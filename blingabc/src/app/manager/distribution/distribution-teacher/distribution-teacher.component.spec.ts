import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionTeacherComponent } from './distribution-teacher.component';

describe('DistributionTeacherComponent', () => {
  let component: DistributionTeacherComponent;
  let fixture: ComponentFixture<DistributionTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
