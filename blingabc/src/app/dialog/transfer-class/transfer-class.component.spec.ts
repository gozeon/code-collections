import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferClassComponent } from './transfer-class.component';

describe('TransferClassComponent', () => {
  let component: TransferClassComponent;
  let fixture: ComponentFixture<TransferClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
