import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Apartment} from '../app-elements';
import {DataService} from '../data.service';
import {RepeatableEvent, SimpleEvent} from './events';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {

  apartment$: Observable<Apartment>;
  repeatableEvents: RepeatableEvent[];
  simpleEvents: SimpleEvent[];
  overlapMessage: string;

  constructor(private apiService: ApiService, private dataService: DataService) {
  }

  ngOnInit() {
    this.apartment$ = this.dataService.response;
    this.apiService.getRepeatableEvents()
      .subscribe((value) => this.repeatableEvents = value ? value : this.repeatableEvents, (error) => console.log(error));
    this.apiService.getSimpleEvents()
      .subscribe((value) => this.simpleEvents = value ? value : this.simpleEvents, (error) => console.log(error));
  }

  addEvent(event: RepeatableEvent) {
    if (!this.checkConflict(event)) {
      this.overlapMessage = '';
      this.repeatableEvents.push(event);
      this.apiService.postRepeatableEvent(event).subscribe((value) => console.log('added:', value));
    } else {
      this.overlapMessage = 'impossibile aggiungere evento, trovato overlap';
    }

  }

  addSimpleEvent(event: SimpleEvent) {
    if (!this.checkConflict(event)) {
      this.overlapMessage = '';
      this.simpleEvents.push(event);
      this.apiService.postSimpleEvent(event).subscribe((value) => console.log('added:', value));
    } else {
      this.overlapMessage = 'impossibile aggiungere evento, trovato overlap';
    }
  }

  deleteSimple(event: SimpleEvent) {
    this.apiService.deleteSimpleEvent(event).subscribe((value) => {
      console.log('%c event deleted successfully', 'color: green; font-weight: bold;');
    }, (error) => console.log(error));
  }

  deleteRepeatable(event: RepeatableEvent) {
    this.apiService.deleteRepeatableEvent(event).subscribe((value) => {
      console.log('%c event deleted successfully', 'color: green; font-weight: bold;');
    }, (error) => console.log(error));
  }

  checkConflict(event) {
    const roomName = event.roomName;
    const startTime = event.startTime;
    const startDate = event.startDate ? new Date(event.startDate).getDay() : this.mapDay(event.from);
    console.log('event params:', roomName, startTime, startDate);
    return this.repeatableEvents.findIndex(ev => ev.roomName === roomName
      && (ev.startTime <= startTime && ev.endTime >= startTime)
      && (this.mapDay(ev.from) <= startDate && this.mapDay(ev.to) >= startDate)) !== -1 ||
      this.simpleEvents.findIndex(ev => ev.roomName === roomName
        && (ev.startTime <= startTime && ev.endTime >= startTime)
        && (new Date(ev.startDate).getDay()  <= startDate && new Date(ev.endData).getDay() >= startDate)) !== -1;
  }

  mapDay(day) {
    if (day === 'monday') {
      return 0;
    }
    if (day === 'tuesday') {
      return 1;
    }
    if (day === 'wednesday') {
      return 2;
    }
    if (day === 'thursday') {
      return 3;
    }
    if (day === 'friday') {
      return 4;
    }
    if (day === 'saturday') {
      return 5;
    }
    if (day === 'sunday') {
      return 6;
    }
  }

}
