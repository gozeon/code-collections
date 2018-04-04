import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignTeacherComponent } from './foreign-teacher.component';

describe('ForeignTeacherComponent', () => {
  let component: ForeignTeacherComponent;
  let fixture: ComponentFixture<ForeignTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
