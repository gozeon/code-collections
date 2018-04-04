import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkPreviewComponent } from './homework-preview.component';

describe('HomeworkPreviewComponent', () => {
  let component: HomeworkPreviewComponent;
  let fixture: ComponentFixture<HomeworkPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworkPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
