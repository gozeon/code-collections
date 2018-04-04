import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassDetialComponent } from './class-detial.component';

describe('ClassDetialComponent', () => {
  let component: ClassDetialComponent;
  let fixture: ComponentFixture<ClassDetialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassDetialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
