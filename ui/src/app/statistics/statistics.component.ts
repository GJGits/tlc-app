import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {Apartment, Room} from '../app-elements';
import {DataService} from '../data.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  apartment$: Observable<Apartment>;
  selectedRoom: Room;
  debugData: any;

  constructor(private apiService: ApiService, private dataService: DataService) {
  }


  ngOnInit() {
    this.apartment$ = this.dataService.response;
  }

  updateChart($event: Room) {
    // todo: change chart when room changes
    if ($event !== undefined) {
      this.selectedRoom = $event;
      this.apiService.getLastReadings(this.selectedRoom.sensor.id).subscribe((value) => {
        this.debugData = value;
      }, (error) => console.log(error));
    }
  }
}
