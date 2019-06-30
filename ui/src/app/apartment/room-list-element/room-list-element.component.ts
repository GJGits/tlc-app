import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Actuator, Room, Sensor} from '../../app-elements';
import {ApiService} from '../../api.service';
import {IMqttMessage, MqttService} from 'ngx-mqtt';

@Component({
  selector: 'app-room-list-element',
  templateUrl: './room-list-element.component.html',
  styleUrls: ['./room-list-element.component.css']
})
export class RoomListElementComponent implements OnInit {

  @Input() room: Room;
  @Output() roomChanged = new EventEmitter<Room>();
  @Output() roomDeleted = new EventEmitter<Room>();
  edit = false;
  src = '../../assets/imgs/';
  types = ['Choose room type', 'cucina', 'bagno', 'salotto', 'camera'];
  avaibleSensors: Sensor[];
  avaibleHeatActs: Actuator[];
  avaibleCoolActs: Actuator[];

  constructor(private apiService: ApiService, private mqttService: MqttService) {
  }

  ngOnInit() {
    this.apiService.getSensors().subscribe(sens => this.avaibleSensors = sens);
    this.apiService.getHeatActs().subscribe(ha => this.avaibleHeatActs = ha);
    this.apiService.getCoolActs().subscribe(ca => this.avaibleCoolActs = ca);
    this.mqttService.observe('presence').subscribe((mex) => {
      const message = mex.payload.toString();
      const firstToken = message.split(':')[0];
      firstToken === 's' ? this.avaibleSensors.push({id: message})
        : firstToken === 'ha' ? this.avaibleHeatActs.push({id: message, status: false})
        : this.avaibleCoolActs.push({id: message, status: false});
    });
  }

  changeMode() {
    this.roomChanged.emit(this.room);
    this.edit = !this.edit;
  }

  saveEdits() {
    this.edit = !this.edit;
  }

  deleteRoom() {
    this.roomDeleted.emit(this.room);
  }
}
