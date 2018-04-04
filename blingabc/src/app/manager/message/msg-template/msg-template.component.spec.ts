import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgTemplateComponent } from './msg-template.component';

describe('MsgTemplateComponent', () => {
  let component: MsgTemplateComponent;
  let fixture: ComponentFixture<MsgTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
