export interface Sensor {
  id: string;
}

export interface Actuator {
  id: string;
}

export interface Room {
  id: string;
  type: string;
  progTemp: number;
  sensor: Sensor;
  heatAct: Actuator;
  coolAct: Actuator;
}

export interface Apartment {
  address: string;
  rooms: Room[];
}

export interface Reading {
  id: string;
  temp: number;
  hum: number;
  index: number;
}

export interface ImagePath {
  roomType: string;
  path: string;
}


