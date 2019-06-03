import { Component, OnInit } from '@angular/core';
import {Apartment, Room} from '../app-elements';
import {DataService} from '../data.service';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})
export class ApartmentComponent implements OnInit {

  apartment: Apartment;

  constructor(private dataService: DataService) { }

  ngOnInit() {
   this.dataService.response.subscribe(apa => this.apartment = apa);
  }

  updateAddress(address: string) {
    this.apartment.address = address;
    this.dataService.updateApartment(this.apartment);
  }

  updateRoom(room: Room) {
    const roomIndex = this.apartment.rooms.findIndex(r => room.id === r.id);
    this.apartment.rooms.splice(roomIndex, 1, room);
    this.dataService.updateApartment(this.apartment);
  }
}
