import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignMarkAbsentComponent } from './foreign-mark-absent.component';

describe('ForeignMarkAbsentComponent', () => {
  let component: ForeignMarkAbsentComponent;
  let fixture: ComponentFixture<ForeignMarkAbsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignMarkAbsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignMarkAbsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
