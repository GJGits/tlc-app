import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RepeatableEvent, SimpleEvent} from '../events';

@Component({
  selector: 'app-events-tab',
  templateUrl: './events-tab.component.html',
  styleUrls: ['./events-tab.component.css']
})
export class EventsTabComponent implements OnInit {

  @Input() repeatableEvents: RepeatableEvent[];
  @Input() simpleEvents: SimpleEvent[];
  @Output() deleteSimple = new EventEmitter<SimpleEvent>();
  @Output() deleteRepeatable = new EventEmitter<RepeatableEvent>();

  constructor() {
  }

  ngOnInit() {
  }

  deleteSimpleEvent(simpleEvent: SimpleEvent) {
    this.deleteSimple.emit(simpleEvent);
    this.simpleEvents = this.simpleEvents
      .filter(ev => ev.roomName !== simpleEvent.roomName &&
        ev.startTime !== simpleEvent.startTime && ev.startDate !== simpleEvent.startDate);
  }

  deleteRepeatableEvent(repeatableEvent: RepeatableEvent) {
    this.deleteRepeatable.emit(repeatableEvent);
    this.repeatableEvents = this.repeatableEvents
      .filter(ev => ev.roomName !== repeatableEvent.roomName &&
        ev.repeat !== repeatableEvent.repeat && ev.startTime !== repeatableEvent.startTime);
  }

}
