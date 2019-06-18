import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ConsoleStatus, Room} from '../../app-elements';
import {ApiService} from '../../api.service';

@Component({
  selector: 'app-console-toolbar',
  templateUrl: './console-toolbar.component.html',
  styleUrls: ['./console-toolbar.component.css']
})
export class ConsoleToolbarComponent implements OnChanges {

  consoleStatus: ConsoleStatus = {roomId: '', mode: '', active: false};
  @Input() room: Room;
  @Output() changeTemp = new EventEmitter<string>();
  @Output() changeStatus = new EventEmitter<ConsoleStatus>();

  constructor(private apiService: ApiService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.room) {
      this.apiService.getConsoleStatus(this.room).subscribe((value) => {
        if (value) {
          this.consoleStatus = value;
        } else {
          this.consoleStatus.roomId = this.room.id;
          this.consoleStatus.mode = '';
          this.consoleStatus.active = false;
        }

      });
    }

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
