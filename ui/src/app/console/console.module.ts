import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ConsoleBarComponent} from './console-bar/console-bar.component';
import {ConsoleDisplayComponent} from './console-display/console-display.component';
import {ConsoleRoomPaginationComponent} from './console-room-pagination/console-room-pagination.component';
import {ConsoleToolbarComponent} from './console-toolbar/console-toolbar.component';

@NgModule({
  declarations: [
    ConsoleBarComponent,
    ConsoleDisplayComponent,
    ConsoleRoomPaginationComponent,
    ConsoleToolbarComponent
  ],
  exports: [
    ConsoleBarComponent,
    ConsoleDisplayComponent,
    ConsoleToolbarComponent,
    ConsoleRoomPaginationComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class ConsoleModule { }
