import {Component, OnInit} from '@angular/core';
import {Apartment, Reading, Room} from '../app-elements';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {DataService} from '../data.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  apartment$: Observable<Apartment>;
  selectedRoom: Room;
  reading$: Observable<Reading>;

  constructor(private apiService: ApiService, private dataService: DataService) {
  }

  ngOnInit() {
    this.apartment$ = this.dataService.response;
  }

  updateDisplay($event: Room) {
    this.selectedRoom = $event;
    this.reading$ = this.apiService.getLastReading($event.sensor);
  }

  updateProgTemp(sign: string) {
    if (sign === '+' && this.selectedRoom.progTemp < 35) {
      this.selectedRoom.progTemp++;
      this.apiService.updateProgTemp(this.selectedRoom).subscribe((value) => {
        console.log(value);
      });
    }
    if (sign === '-' && this.selectedRoom.progTemp > 15) {
      this.selectedRoom.progTemp--;
      this.apiService.updateProgTemp(this.selectedRoom);
    }
  }

}
