/* MODULES */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ConsoleModule} from './console/console.module';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/* COMPONENTS */
import { AppComponent } from './app.component';
import { RouterBarComponent } from './router-bar/router-bar.component';
import { ConsoleComponent } from './console/console.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {HttpErrorInterceptor} from './http-error.interceptor';
import { ApartmentAddressComponent } from './apartment/apartment-address/apartment-address.component';
import { RoomListElementComponent } from './apartment/room-list-element/room-list-element.component';
import { RoomFormComponent } from './apartment/room-form/room-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DeleteRoomModalComponent } from './apartment/delete-room-modal/delete-room-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    RouterBarComponent,
    ConsoleComponent,
    ApartmentComponent,
    StatisticsComponent,
    PageNotFoundComponent,
    ApartmentAddressComponent,
    RoomListElementComponent,
    RoomFormComponent,
    DeleteRoomModalComponent,
  ],
  imports: [
    BrowserModule,
    ConsoleModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
