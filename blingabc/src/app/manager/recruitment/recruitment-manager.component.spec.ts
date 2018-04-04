import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentManagerComponent } from './recruitment-manager.component';

describe('RecruitmentManagerComponent', () => {
  let component: RecruitmentManagerComponent;
  let fixture: ComponentFixture<RecruitmentManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
