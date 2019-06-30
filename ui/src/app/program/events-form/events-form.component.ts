import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../../api.service';
import {Room} from '../../app-elements';
import {RepeatableEvent} from '../events';

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css']
})
export class EventsFormComponent implements OnInit {

  @Input() rooms: Room[];
  @Output() newRepeatableEvent = new EventEmitter<RepeatableEvent>();
  repeatOptions = ['every day'];
  dayOfWeeks = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  dateToDate: boolean;
  model: RepeatableEvent;
  errors: string;

  constructor(private apiService: ApiService) {
    this.model = {roomName: '', temp: 15, startTime: 0, endTime: 0, from: '', to: '', repeat: ''};
  }

  ngOnInit() {
  }

  switch() {
    this.dateToDate = !this.dateToDate;
  }

  addEvent() {
    if ((this.model.startTime < this.model.endTime)) {
      if (this.model.from && this.model.to) {
        this.model.repeat = this.model.from + '-' + this.model.to;
      }
      if (this.model.repeat === 'every day') {
        this.model.from = 'monday';
        this.model.to = 'sunday';
      }
      this.newRepeatableEvent.emit(this.model);
    } else {
      this.errors = 'correct errors';
    }
  }
}
