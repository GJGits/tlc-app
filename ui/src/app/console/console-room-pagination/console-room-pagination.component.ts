import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Room} from '../../app-elements';

@Component({
  selector: 'app-console-room-pagination',
  templateUrl: './console-room-pagination.component.html',
  styleUrls: ['./console-room-pagination.component.css']
})
export class ConsoleRoomPaginationComponent implements OnChanges {

  index = 0;
  @Input() rooms: Room[];
  @Output() roomChanged = new EventEmitter<Room>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.rooms !== null) {
      this.roomChanged.emit(this.rooms[this.index]);
    }

  }

  changeRoom($event: MouseEvent) {
    const up = ($event.target as HTMLSpanElement).id === 'up';
    if (up && this.index < this.rooms.length - 1) {
      this.index++;
      this.roomChanged.emit(this.rooms[this.index]);
    }
    if (!up && this.index > 0) {
      this.index--;
      this.roomChanged.emit(this.rooms[this.index]);
    }
  }


}
