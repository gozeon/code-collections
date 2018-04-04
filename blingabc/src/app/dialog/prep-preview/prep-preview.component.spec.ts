import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepPreviewComponent } from './prep-preview.component';

describe('PrepPreviewComponent', () => {
  let component: PrepPreviewComponent;
  let fixture: ComponentFixture<PrepPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
