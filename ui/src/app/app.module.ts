/* MODULES */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {ConsoleModule} from './console/console.module';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InfoRoutingModule } from './infos/menu/info-routing.module';
import { ChartsModule } from 'ng2-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import {Ng2VirtualKeyboardModule} from 'ng2-virtual-keyboard';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions
} from 'ngx-mqtt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 9001,
  path: '/mqtt'
};

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
import { InfosComponent } from './infos/infos.component';
import { LoginComponent } from './infos/login/login.component';
import { GroupInfoComponent } from './infos/group-info/group-info.component';
import { DeviceInfoComponent } from './infos/device-info/device-info.component';
import { LogsComponent } from './infos/logs/logs.component';
import { MenuComponent } from './infos/menu/menu.component';
import {AuthInterceptor} from './auth-interceptor';
import {LineChartComponent} from './statistics/line-chart/line-chart.component';
import { ProgramComponent } from './program/program.component';
import { EventsTabComponent } from './program/events-tab/events-tab.component';
import { EventsFormComponent } from './program/events-form/events-form.component';
import { SimpleEventFormComponent } from './program/simple-event-form/simple-event-form.component';
import { NetworkComponent } from './network/network.component';


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
    InfosComponent,
    LoginComponent,
    GroupInfoComponent,
    DeviceInfoComponent,
    LogsComponent,
    MenuComponent,
    LineChartComponent,
    ProgramComponent,
    EventsTabComponent,
    EventsFormComponent,
    SimpleEventFormComponent,
    NetworkComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ConsoleModule,
    Ng2VirtualKeyboardModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InfoRoutingModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    ChartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
