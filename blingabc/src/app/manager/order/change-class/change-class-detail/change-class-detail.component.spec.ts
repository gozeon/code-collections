import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeClassDetailComponent } from './change-class-detail.component';

describe('ChangeClassDetailComponent', () => {
  let component: ChangeClassDetailComponent;
  let fixture: ComponentFixture<ChangeClassDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeClassDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeClassDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
