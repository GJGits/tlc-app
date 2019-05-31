import {Component, OnInit} from '@angular/core';
import {Apartment, Reading} from '../app-elements';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  apartment$: Observable<Apartment>;
  reading: Reading;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apartment$ = this.apiService.getApartment();
  }

}
