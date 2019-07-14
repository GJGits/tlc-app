import {Apartment} from '../app-elements';

export interface GroupInfo {
  group_info: any;
  group_id: string;
  group_psw: string;
}

export interface ServerMessage {
  error: boolean;
  message: string;
}

export interface DeviceInfo {
  status: number;
  data: DeviceData;
}

export interface DeviceData {
  configuration: Apartment;
  nickname: string;
  device_status: number;
  device_mac: string;
}

export interface Log {
  status: number;
  data: Event[];
}

export interface Event {
  event_id: number;
  timestamp_dev: any;
  timestamp_srv: any;
  event: string;
  device_id: string;
}

export interface Message {
  message: string;
  sequence: number;
}
