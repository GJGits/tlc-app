import {Injectable} from '@angular/core';
import {Apartment, Reading, Sensor} from './app-elements';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from './api.service';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {ChartData} from './statistics/line-chart/chart-data';

const initApartment: Apartment = {address: 'Address not set', rooms: []};
const initReading: Reading = {id: '', temp: 15.00, hum: 50, index: 15.00};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private responseSource = new BehaviorSubject<Apartment>(initApartment);
  private readingSource = new BehaviorSubject<Reading>(initReading);
  private dataSource = new BehaviorSubject<ChartData[]>([]);
  response = this.responseSource.asObservable();
  reading = this.readingSource.asObservable();
  chartData = this.dataSource.asObservable();

  constructor(private apiService: ApiService, private mqttService: MqttService) {
    apiService.getApartment().subscribe(res => this.responseSource.next(res));
  }

  updateApartment(apartment: Apartment) {
    this.responseSource.next(apartment);
    this.apiService.postApartment(apartment).subscribe(value => {
      console.log(value);
    });
  }

  updateReading(sensor: Sensor) {
    this.apiService.getLastReading(sensor).subscribe(reading => {
      this.readingSource.next(reading);
      console.log(reading);
    });
    this.mqttService.observe('readings').subscribe(((message: IMqttMessage) => {
      const tokens = message.payload.toString().split(', ');
      const reading: Reading = {
        id: tokens[3].split('=')[1],
        temp: +tokens[0].split('=')[1],
        hum: +tokens[1].split('=')[1],
        index: +tokens[2].split('=')[1]
      };
      if (sensor.id === reading.id) {
        console.log(reading);
        this.readingSource.next(reading);
      }
    }));
  }

  updateChartData(data: ChartData[]) {
    this.dataSource.next(data);
  }

}
