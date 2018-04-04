import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredClassComponent } from './retired-class.component';

describe('RetiredClassComponent', () => {
  let component: RetiredClassComponent;
  let fixture: ComponentFixture<RetiredClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetiredClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetiredClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
