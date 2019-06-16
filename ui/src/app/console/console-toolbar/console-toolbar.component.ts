import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-console-toolbar',
  templateUrl: './console-toolbar.component.html',
  styleUrls: ['./console-toolbar.component.css']
})
export class ConsoleToolbarComponent implements OnInit {

  mode = '';
  active: boolean;
  @Output() changeTemp = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  changeMode(type: string): void {
    this.mode = type;
  }

  emitChange(sign: string) {
    if (this.mode === 'manual') {
      this.changeTemp.emit(sign);
    }
  }

  toggleStatus() {
    if (this.active) {
      this.active = !this.active;
      this.mode = '';
    } else {
      this.active = !this.active;
      this.mode = 'manual';
    }

  }
}
