import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Apartment, Reading, Sensor} from './app-elements';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }

  getApartment(): Observable<Apartment> {
    return null;
  }

  getLastReading(sensor: Sensor): Observable<Reading> {
    return null;
  }

}
