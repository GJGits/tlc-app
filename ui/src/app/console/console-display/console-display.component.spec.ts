import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleDisplayComponent } from './console-display.component';

describe('ConsoleDisplayComponent', () => {
  let component: ConsoleDisplayComponent;
  let fixture: ComponentFixture<ConsoleDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
