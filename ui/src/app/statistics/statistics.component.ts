import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {Apartment, Room} from '../app-elements';
import {DataService} from '../data.service';
import {ChartData} from './line-chart/chart-data';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  apartment$: Observable<Apartment>;
  data$: Observable<ChartData[]>;
  debugData: any;

  constructor(private apiService: ApiService, private dataService: DataService) {
  }


  ngOnInit() {
    this.apartment$ = this.dataService.response;
  }

  updateChart($event: Room) {
    // todo: change chart when room changes
    if ($event !== undefined) {
      console.log('room', $event);
      this.data$ = this.apiService.getLastReadings($event.sensor.id);
    }
  }
}
