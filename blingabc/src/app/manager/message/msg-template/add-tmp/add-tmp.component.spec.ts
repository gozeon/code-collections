import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTmpComponent } from './add-tmp.component';

describe('AddTmpComponent', () => {
  let component: AddTmpComponent;
  let fixture: ComponentFixture<AddTmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
