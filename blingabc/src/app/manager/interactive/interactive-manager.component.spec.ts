import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveManagerComponent } from './interactive-manager.component';

describe('InteractiveManagerComponent', () => {
  let component: InteractiveManagerComponent;
  let fixture: ComponentFixture<InteractiveManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
