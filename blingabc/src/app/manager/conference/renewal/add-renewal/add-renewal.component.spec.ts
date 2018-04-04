import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRenewalComponent } from './add-renewal.component';

describe('AddRenewalComponent', () => {
  let component: AddRenewalComponent;
  let fixture: ComponentFixture<AddRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
