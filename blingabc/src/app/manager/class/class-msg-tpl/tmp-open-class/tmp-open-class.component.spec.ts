import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmpOpenClassComponent } from './tmp-open-class.component';

describe('TmpOpenClassComponent', () => {
  let component: TmpOpenClassComponent;
  let fixture: ComponentFixture<TmpOpenClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmpOpenClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmpOpenClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
