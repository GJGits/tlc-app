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
    this.repeatableEvents.push(event);
    this.apiService.postRepeatableEvent(event).subscribe((value) => console.log('added:', value));
  }

  addSimpleEvent(event: SimpleEvent) {
    this.simpleEvents.push(event);
    this.apiService.postSimpleEvent(event).subscribe((value) => console.log('added:', value));
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

}
