import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationProcessComponent } from './application-process.component';

describe('ApplicationProcessComponent', () => {
  let component: ApplicationProcessComponent;
  let fixture: ComponentFixture<ApplicationProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
