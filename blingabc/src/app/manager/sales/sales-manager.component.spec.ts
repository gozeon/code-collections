import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesManagerComponent } from './sales-manager.component';

describe('SalesManagerComponent', () => {
  let component: SalesManagerComponent;
  let fixture: ComponentFixture<SalesManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
