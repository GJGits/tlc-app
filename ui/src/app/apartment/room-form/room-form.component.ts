import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Actuator, Room, Sensor} from '../../app-elements';
import {ApiService} from '../../api.service';
import {IMqttMessage, MqttService} from 'ngx-mqtt';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit {

  room: Room = {
    id: 'a', type: 'select type',
    progTemp: 15, sensor: {id: 'a'}, heatAct: {id: 'a', status: false}, coolAct: {id: 'a', status: false}
  };
  types = ['cucina', 'bagno', 'salotto', 'camera'];
  avaibleSensors: Sensor[];
  avaibleHeatActs: Actuator[];
  avaibleCoolActs: Actuator[];
  showAlert = false;
  @Output() roomCreated = new EventEmitter<Room>();

  constructor(private apiService: ApiService, private mqttService: MqttService) {
  }

  ngOnInit() {
    this.apiService.getSensors().subscribe(sens => this.avaibleSensors = sens);
    this.apiService.getHeatActs().subscribe(ha => this.avaibleHeatActs = ha);
    this.apiService.getCoolActs().subscribe(ca => this.avaibleCoolActs = ca);
    this.mqttService.observe('presence').subscribe((message: IMqttMessage) => {
      const mex = message.payload.toString();
      const tokens = mex.split(':');
      if (tokens[0] === 's') {
        this.avaibleSensors.push({id: mex});
      } else if (tokens[0] === 'ca') {
        this.avaibleCoolActs.push({id: mex, status: false});
      } else {
        this.avaibleHeatActs.push({id: mex, status: false});
      }
    });
  }

  addRoom() {
    if (this.room.type !== 'select type' && this.room.type !== '') {
      if (this.room.sensor.id !== 'a' && this.room.heatAct.id !== 'a' && this.room.coolAct.id !== 'a') {
        if (this.room.progTemp >= 15 && this.room.progTemp <= 35) {
          this.showAlert = false;
          const sensIndex = this.avaibleSensors.findIndex(s => s.id === this.room.sensor.id);
          const caIndex = this.avaibleSensors.findIndex(s => s.id === this.room.coolAct.id);
          const haIndex = this.avaibleSensors.findIndex(s => s.id === this.room.heatAct.id);
          this.avaibleSensors.splice(sensIndex, 1);
          this.avaibleCoolActs.splice(caIndex, 1);
          this.avaibleHeatActs.splice(haIndex, 1);
          this.roomCreated.emit(this.room);
          this.room = {
            id: 'a', type: 'select type',
            progTemp: 15, sensor: {id: 'a'}, heatAct: {id: 'a', status: false}, coolAct: {id: 'a', status: false}
          };
        } else {
          this.showAlert = true;
        }
      } else {
        this.showAlert = true;
      }
    } else {
      this.showAlert = true;
    }

  }
}
