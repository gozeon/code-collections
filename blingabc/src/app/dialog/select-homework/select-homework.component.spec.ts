import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHomeworkComponent } from './select-homework.component';

describe('SelectHomeworkComponent', () => {
  let component: SelectHomeworkComponent;
  let fixture: ComponentFixture<SelectHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
