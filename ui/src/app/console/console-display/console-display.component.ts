import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-console-display',
  templateUrl: './console-display.component.html',
  styleUrls: ['./console-display.component.css']
})
export class ConsoleDisplayComponent implements OnInit {

  @Input() value: string;
  @Input() format: string;
  @Input() tag: string;

  constructor() {
  }

  ngOnInit() {
  }

}
