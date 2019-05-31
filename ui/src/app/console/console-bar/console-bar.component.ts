import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-console-bar',
  templateUrl: './console-bar.component.html',
  styleUrls: ['./console-bar.component.css']
})
export class ConsoleBarComponent implements OnInit {

  @Input() apartmentAddress = 'address not set';
  date = new Date();

  constructor() {
  }

  ngOnInit() {
    setInterval(() => {
      this.date = new Date();
    }, 3600);
  }

}
