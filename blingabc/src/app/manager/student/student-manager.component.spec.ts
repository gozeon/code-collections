import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentManagerComponent } from './student-manager.component';

describe('StudentManagerComponent', () => {
  let component: StudentManagerComponent;
  let fixture: ComponentFixture<StudentManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
