import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRenewalComponent } from './update-renewal.component';

describe('UpdateRenewalComponent', () => {
  let component: UpdateRenewalComponent;
  let fixture: ComponentFixture<UpdateRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
