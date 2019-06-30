import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleEventFormComponent } from './simple-event-form.component';

describe('SimpleEventFormComponent', () => {
  let component: SimpleEventFormComponent;
  let fixture: ComponentFixture<SimpleEventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleEventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
