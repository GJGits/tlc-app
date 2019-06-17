import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ConsoleStatus} from '../../app-elements';
import {ApiService} from '../../api.service';

@Component({
  selector: 'app-console-toolbar',
  templateUrl: './console-toolbar.component.html',
  styleUrls: ['./console-toolbar.component.css']
})
export class ConsoleToolbarComponent implements OnInit {

  consoleStatus: ConsoleStatus;
  @Output() changeTemp = new EventEmitter<string>();
  @Output() changeStatus = new EventEmitter<ConsoleStatus>();

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getConsoleStatus().subscribe((value) => {
      this.consoleStatus = value;
      console.log(value);
    });
  }

  changeMode(type: string): void {
    this.consoleStatus.mode = type;
    this.changeStatus.emit(this.consoleStatus);
  }

  emitChange(sign: string) {
    if (this.consoleStatus.mode === 'manual') {
      this.changeTemp.emit(sign);
    }
  }

  toggleStatus() {
    this.consoleStatus.active = !this.consoleStatus.active;
    this.changeStatus.emit(this.consoleStatus);
  }
}
