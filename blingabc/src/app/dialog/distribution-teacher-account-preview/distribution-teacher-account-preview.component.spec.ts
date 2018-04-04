import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionTeacherAccountPreviewComponent } from './distribution-teacher-account-preview.component';

describe('DistributionTeacherAccountPreviewComponent', () => {
  let component: DistributionTeacherAccountPreviewComponent;
  let fixture: ComponentFixture<DistributionTeacherAccountPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionTeacherAccountPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionTeacherAccountPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
