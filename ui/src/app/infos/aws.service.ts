import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DeviceInfo, GroupInfo, Log} from './info';

@Injectable({
  providedIn: 'root'
})
export class AwsService {

  baseURL = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getGroupInfo(groupId: string) {
    return this.http.get<string>(this.baseURL + 'user/' + groupId);
  }

  postGroupInfo(model: GroupInfo) {
    const body = {group_info: model.group_info, group_id: model.group_id};
    return this.http.post(this.baseURL + 'user/' + model.group_id, body);
  }

  getDeviceInfo() {
    return this.http.get<string>(this.baseURL + 'user/' + environment.groupId + '/devices');
  }

  postDeviceInfo(model: DeviceInfo) {
    const body = {device_mac: model.data.device_mac, nickname: model.data.nickname, configuration: model.data.configuration};
    return this.http.post(this.baseURL + 'user/' + environment.groupId + '/devices', body);
  }

  getLogs() {
    return this.http.get<Log>(this.baseURL + 'user/' + environment.groupId + '/logs');
  }

}
