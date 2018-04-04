import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHomeworkComponent } from './update-homework.component';

describe('UpdateHomeworkComponent', () => {
  let component: UpdateHomeworkComponent;
  let fixture: ComponentFixture<UpdateHomeworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateHomeworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
