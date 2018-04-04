import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredVerifyComponent } from './retired-verify.component';

describe('RetiredVerifyComponent', () => {
  let component: RetiredVerifyComponent;
  let fixture: ComponentFixture<RetiredVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetiredVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetiredVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
