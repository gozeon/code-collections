import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrepComponent } from './add-prep.component';

describe('AddPrepComponent', () => {
  let component: AddPrepComponent;
  let fixture: ComponentFixture<AddPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
