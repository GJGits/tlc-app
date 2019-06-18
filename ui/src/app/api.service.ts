import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Actuator, Apartment, ConsoleStatus, Reading, Room, Sensor} from './app-elements';
import {environment} from '../environments/environment';
import {ChartData} from './statistics/line-chart/chart-data';
import {RepeatableEvent, SimpleEvent} from './program/events';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }

  getApartment(): Observable<Apartment> {
    return this.httpClient.get<Apartment>(this.baseUrl + 'apartment');
  }

  postApartment(apartment: Apartment) {
    console.log('post apartment: ' + apartment.address);
    return this.httpClient.post(this.baseUrl + 'apartment', apartment);
  }

  getLastReading(sensor: Sensor): Observable<Reading> {
    return this.httpClient.get<Reading>(this.baseUrl + 'reading/' + sensor.id);
  }

  updateProgTemp(room: Room) {
    return this.httpClient.post(this.baseUrl + 'apartment/updateProgTemp', room);
  }

  postCommand(sensor: Sensor, actuator: Actuator, progTemp: number) {
    const sensorId = sensor.id;
    const actuatorId = actuator.id;
    const temp: any = {temp: progTemp};
    return this.httpClient.post(this.baseUrl + 'command/' + sensorId, +'/' + actuatorId, temp);
  }

  getSensors() {
    return this.httpClient.get<Sensor[]>(this.baseUrl + 'sens');
  }

  getHeatActs() {
    return this.httpClient.get<Actuator[]>(this.baseUrl + 'acts/heat');
  }

  getCoolActs() {
    return this.httpClient.get<Actuator[]>(this.baseUrl + 'acts/cool');
  }

  getLastReadings(sensorId) {
    return this.httpClient.get<ChartData[]>(this.baseUrl + 'reading/lastReadings/' + sensorId);
  }

  getRepeatableEvents() {
    return this.httpClient.get<RepeatableEvent[]>(this.baseUrl + 'events/repeatable');
  }

  getSimpleEvents() {
    return this.httpClient.get<SimpleEvent[]>(this.baseUrl + 'events/simple');
  }

  postRepeatableEvent(model: RepeatableEvent) {
    return this.httpClient.post(this.baseUrl + 'events/repeatable', model);
  }

  postSimpleEvent(model: SimpleEvent) {
    return this.httpClient.post(this.baseUrl + 'events/simple', model);
  }

  toggleActivation(consoleStatus: ConsoleStatus) {
    return this.httpClient.post(this.baseUrl + 'events/status', consoleStatus);
  }

  getConsoleStatus(room: Room) {
    return this.httpClient.get<ConsoleStatus>(this.baseUrl + 'events/status/' + room.id.replace(/\s/g, ''));
  }

}
