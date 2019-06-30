import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Apartment} from '../../app-elements';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-apartment-address',
  templateUrl: './apartment-address.component.html',
  styleUrls: ['./apartment-address.component.css']
})
export class ApartmentAddressComponent implements OnInit {

  @Input() address: string;
  @Output() changedAddress = new EventEmitter<string>();
  edit = false;

  constructor() { }

  ngOnInit() {
  }

  toggleMode() {
    this.edit = !this.edit;
  }

  saveEdits() {
    this.changedAddress.emit(this.address);
    this.edit = !this.edit;
  }
}
