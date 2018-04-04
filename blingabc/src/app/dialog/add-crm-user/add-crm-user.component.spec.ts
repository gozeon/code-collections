import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrmUserComponent } from './add-crm-user.component';

describe('AddCrmUserComponent', () => {
  let component: AddCrmUserComponent;
  let fixture: ComponentFixture<AddCrmUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrmUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrmUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
