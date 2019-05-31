import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleRoomPaginationComponent } from './console-room-pagination.component';

describe('ConsoleRoomPaginationComponent', () => {
  let component: ConsoleRoomPaginationComponent;
  let fixture: ComponentFixture<ConsoleRoomPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleRoomPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleRoomPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
