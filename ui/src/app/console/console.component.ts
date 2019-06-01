import {Component, OnInit} from '@angular/core';
import {Apartment, Reading, Room} from '../app-elements';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  apartment$: Observable<Apartment>;
  progTemp = 15;
  reading$: Observable<Reading>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apartment$ = this.apiService.getApartment();
  }

  updateReading($event: Room) {
    this.reading$ = this.apiService.getLastReading($event.sensor);
  }
}
