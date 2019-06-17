import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ConsoleComponent} from './console/console.component';
import {ApartmentComponent} from './apartment/apartment.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {ProgramComponent} from './program/program.component';

const appRoutes: Routes = [
  {path: 'consoleStatus', component: ConsoleComponent},
  {path: 'apartment', component: ApartmentComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'program', component: ProgramComponent},
  {path: '', redirectTo: 'consoleStatus', pathMatch: 'full'}
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
