import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffGroupComponent } from './staff-group.component';

describe('StaffGroupComponent', () => {
  let component: StaffGroupComponent;
  let fixture: ComponentFixture<StaffGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
