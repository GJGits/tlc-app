import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {Apartment, Room} from '../app-elements';
import {DataService} from '../data.service';
import {ChartData} from './line-chart/chart-data';
import {IMqttMessage, MqttService} from 'ngx-mqtt';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  apartment$: Observable<Apartment>;
  data$: Observable<ChartData[]>;
  currentRoom: Room;
  debugData: any;

  constructor(private apiService: ApiService, private dataService: DataService, private mqttService: MqttService) {
  }


  ngOnInit() {
    this.apartment$ = this.dataService.response;
    this.mqttService.observe('readings').subscribe((message: IMqttMessage) => {
      if (this.currentRoom) {
        this.apiService.getLastReadings(this.currentRoom.sensor.id).subscribe((data) => {
          this.dataService.updateChartData(data);
        });
      }
    }, (error) => console.log(error));
  }

  updateChart($event: Room) {
    if ($event !== undefined) {
      this.currentRoom = $event;
      this.data$ = this.apiService.getLastReadings($event.sensor.id);
    }
  }
}
