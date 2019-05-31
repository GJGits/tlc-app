/* MODULES */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ConsoleModule} from './console/console.module';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';

/* COMPONENTS */
import { AppComponent } from './app.component';
import { RouterBarComponent } from './router-bar/router-bar.component';
import { ConsoleComponent } from './console/console.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    RouterBarComponent,
    ConsoleComponent,
    ApartmentComponent,
    StatisticsComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    ConsoleModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
