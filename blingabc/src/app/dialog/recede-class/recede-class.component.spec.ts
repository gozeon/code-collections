import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecedeClassComponent } from './recede-class.component';

describe('RecedeClassComponent', () => {
  let component: RecedeClassComponent;
  let fixture: ComponentFixture<RecedeClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecedeClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecedeClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
