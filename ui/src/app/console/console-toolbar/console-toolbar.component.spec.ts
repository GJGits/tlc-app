import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleToolbarComponent } from './console-toolbar.component';

describe('ConsoleToolbarComponent', () => {
  let component: ConsoleToolbarComponent;
  let fixture: ComponentFixture<ConsoleToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
