import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from '../../app-elements';
import {RepeatableEvent, SimpleEvent} from '../events';

@Component({
  selector: 'app-simple-event-form',
  templateUrl: './simple-event-form.component.html',
  styleUrls: ['./simple-event-form.component.css']
})
export class SimpleEventFormComponent implements OnInit {

  @Input() rooms: Room[];
  @Output() newSimpleEvent = new EventEmitter<SimpleEvent>();
  model: SimpleEvent;
  errors: string;

  constructor() {
    this.model = {roomName: '', temp: 15, startTime: 0, endTime: 0, startDate: '', endData: '', repeat: ''};
  }

  ngOnInit() {
  }

  addEvent() {
    if ((this.model.startTime < this.model.endTime) && (this.model.startDate.localeCompare(this.model.endData) <= 0)) {
      this.model.repeat = this.model.startDate + '-' + this.model.endData;
      this.newSimpleEvent.emit(this.model);
      this.model = {roomName: '', temp: 15, startTime: 0, endTime: 0, startDate: '', endData: '', repeat: ''};
    } else {
      this.errors = 'correct errors';
    }
  }

}
