import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ConsoleComponent} from './console/console.component';
import {ApartmentComponent} from './apartment/apartment.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {InfosComponent} from './infos/infos.component';

const appRoutes: Routes = [
  {path: 'console', component: ConsoleComponent},
  {path: 'apartment', component: ApartmentComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'infos', component: InfosComponent},
  {path: '', redirectTo: 'console', pathMatch: 'full'},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
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
