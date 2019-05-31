import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleBarComponent } from './console-bar.component';

describe('ConsoleBarComponent', () => {
  let component: ConsoleBarComponent;
  let fixture: ComponentFixture<ConsoleBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
