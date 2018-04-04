import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBeInClassComponent } from './to-be-in-class.component';

describe('ToBeInClassComponent', () => {
  let component: ToBeInClassComponent;
  let fixture: ComponentFixture<ToBeInClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToBeInClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToBeInClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
