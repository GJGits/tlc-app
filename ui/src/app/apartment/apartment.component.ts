import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Apartment} from '../app-elements';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})
export class ApartmentComponent implements OnInit {

  apartment$: Observable<Apartment>;

  constructor() { }

  ngOnInit() {
  }

}
