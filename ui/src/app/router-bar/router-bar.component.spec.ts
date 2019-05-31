import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterBarComponent } from './router-bar.component';

describe('RouterBarComponent', () => {
  let component: RouterBarComponent;
  let fixture: ComponentFixture<RouterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
