import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMsgTplDetialComponent } from './class-msg-tpl-detial.component';

describe('ClassMsgTplDetialComponent', () => {
  let component: ClassMsgTplDetialComponent;
  let fixture: ComponentFixture<ClassMsgTplDetialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassMsgTplDetialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassMsgTplDetialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
