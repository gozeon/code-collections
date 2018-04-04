import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenClassToComponent } from './open-class-to.component';

describe('OpenClassToComponent', () => {
  let component: OpenClassToComponent;
  let fixture: ComponentFixture<OpenClassToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenClassToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenClassToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
