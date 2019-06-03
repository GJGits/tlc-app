import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Apartment, Reading, Room, Sensor} from './app-elements';
import {environment} from '../environments/environment';

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
    this.httpClient.post(this.baseUrl + 'apartment', apartment);
  }

  getLastReading(sensor: Sensor): Observable<Reading> {
    return this.httpClient.get<Reading>(this.baseUrl + 'reading/' + sensor.id);
  }

  updateProgTemp(room: Room) {
    const url = this.baseUrl + 'apartment/updateProgTemp';
    return this.httpClient.post(url, room);
  }

}
