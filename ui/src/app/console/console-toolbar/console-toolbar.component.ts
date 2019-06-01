import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-console-toolbar',
  templateUrl: './console-toolbar.component.html',
  styleUrls: ['./console-toolbar.component.css']
})
export class ConsoleToolbarComponent implements OnInit {

  mode = 'manual';
  @Output() changeTemp = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  changeMode(type: string): void {
    this.mode = type;
  }

  emitChange(sign: string) {
    this.changeTemp.emit(sign);
  }

}
