import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {shareReplay, tap} from 'rxjs/operators';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import {RegisterModel} from './menu/register-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }

  login(model: RegisterModel) {
    return this.httpClient.post(this.baseURL + 'auth', model).pipe(tap(res => this.setSession(res)), shareReplay());
  }

  private setSession(authResult) {
    console.log('exp: ' + jwt_decode(authResult.access_token).exp);
    const expiresAt = moment((jwt_decode(authResult.access_token).exp) * 1000);
    console.log('expires at: ' + expiresAt);

    localStorage.setItem('id_token', authResult.access_token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

}
