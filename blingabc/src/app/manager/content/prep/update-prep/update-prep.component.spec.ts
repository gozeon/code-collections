import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePrepComponent } from './update-prep.component';

describe('UpdatePrepComponent', () => {
  let component: UpdatePrepComponent;
  let fixture: ComponentFixture<UpdatePrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
