import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDistributionComponent } from './update-distribution.component';

describe('UpdateDistributionComponent', () => {
  let component: UpdateDistributionComponent;
  let fixture: ComponentFixture<UpdateDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
