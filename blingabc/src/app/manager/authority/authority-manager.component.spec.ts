import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagerComponent } from './authority-manager.component';

describe('AuthorityManagerComponent', () => {
  let component: AuthorityManagerComponent;
  let fixture: ComponentFixture<AuthorityManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
