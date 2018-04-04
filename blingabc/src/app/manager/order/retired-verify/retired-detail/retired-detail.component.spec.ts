import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredDetailComponent } from './retired-detail.component';

describe('RetiredDetailComponent', () => {
  let component: RetiredDetailComponent;
  let fixture: ComponentFixture<RetiredDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetiredDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetiredDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
