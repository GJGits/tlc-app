import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomListElementComponent } from './room-list-element.component';

describe('RoomListElementComponent', () => {
  let component: RoomListElementComponent;
  let fixture: ComponentFixture<RoomListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
