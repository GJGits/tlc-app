import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ConsoleComponent} from './console/console.component';
import {ApartmentComponent} from './apartment/apartment.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {path: 'console', component: ConsoleComponent},
  {path: 'apartment', component: ApartmentComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: '', redirectTo: 'console', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes),
    CommonModule
  ], exports: [RouterModule]
})
export class AppRoutingModule {
}
