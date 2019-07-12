import {Component, OnInit} from '@angular/core';
import {Apartment, ConsoleStatus, Reading, Room} from '../app-elements';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {DataService} from '../data.service';
import {IMqttMessage, MqttService} from 'ngx-mqtt';


@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  apartment$: Observable<Apartment>;
  selectedRoom: Room;
  reading$: Observable<Reading>;

  constructor(private apiService: ApiService, private dataService: DataService, private mqttService: MqttService) {
  }

  ngOnInit() {
    this.apartment$ = this.dataService.response;
    this.reading$ = this.dataService.reading;
    this.mqttService.observe('newTemp').subscribe((message: IMqttMessage) => {
      this.selectedRoom.progTemp = +message.payload.toString();
    }, (error) => console.log(error));
  }

  updateDisplay($event: Room) {
    if ($event !== undefined) {
      this.selectedRoom = $event;
      this.dataService.updateReading($event.sensor);
    }

  }

  updateProgTemp(sign: string) {
    if (sign === '+' && this.selectedRoom && this.selectedRoom.progTemp < 35) {
      this.selectedRoom.progTemp++;
      this.apiService.updateProgTemp(this.selectedRoom).subscribe((value) => console.log(value));
      // this.apiService.postCommand(this.selectedRoom.sensor, this.selectedRoom.heatAct, this.selectedRoom.progTemp);
    }
    if (sign === '-' && this.selectedRoom && this.selectedRoom.progTemp > 15) {
      this.selectedRoom.progTemp--;
      this.apiService.updateProgTemp(this.selectedRoom).subscribe((value) => console.log(value));
      // this.apiService.postCommand(this.selectedRoom.sensor, this.selectedRoom.coolAct, this.selectedRoom.progTemp);
    }
  }

  activate($event: ConsoleStatus) {
    const roomId = $event.roomId;
    $event.roomId = roomId;
    this.apiService.toggleActivation($event).subscribe((value) => console.log(value));
  }
}
