import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWorkComponent } from './home-work.component';

describe('HomeWorkComponent', () => {
  let component: HomeWorkComponent;
  let fixture: ComponentFixture<HomeWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
