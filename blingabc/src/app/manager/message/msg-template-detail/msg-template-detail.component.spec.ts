import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgTemplateDetailComponent } from './msg-template-detail.component';

describe('MsgTemplateDetailComponent', () => {
  let component: MsgTemplateDetailComponent;
  let fixture: ComponentFixture<MsgTemplateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgTemplateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
