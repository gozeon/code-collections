import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMsgTplComponent } from './class-msg-tpl.component';

describe('ClassMsgTplComponent', () => {
  let component: ClassMsgTplComponent;
  let fixture: ComponentFixture<ClassMsgTplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassMsgTplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassMsgTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
