import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassTimeComponent } from './class-time.component';

describe('ClassTimeComponent', () => {
  let component: ClassTimeComponent;
  let fixture: ComponentFixture<ClassTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
