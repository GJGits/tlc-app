export interface RepeatableEvent {
  roomName: string;
  temp: number;
  startTime: number;
  endTime: number;
  from: string;
  to: string;
  repeat: string;
}

export interface SimpleEvent {
  roomName: string;
  temp: number;
  startTime: number;
  endTime: number;
  startDate: string;
  endData: string;
  repeat: string;
}
