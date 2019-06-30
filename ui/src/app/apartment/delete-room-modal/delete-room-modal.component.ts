import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-delete-room-modal',
  templateUrl: './delete-room-modal.component.html',
  styleUrls: ['./delete-room-modal.component.css']
})
export class DeleteRoomModalComponent implements OnInit {

  @Output() deleteRoom = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  delete() {
    this.deleteRoom.emit();
  }
}
