import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {GroupInfoComponent} from '../group-info/group-info.component';
import {DeviceInfoComponent} from '../device-info/device-info.component';
import {LogsComponent} from '../logs/logs.component';
import {MenuComponent} from './menu.component';
import {PageNotFoundComponent} from '../../page-not-found/page-not-found.component';
import {AuthGuard} from '../../auth.guard';

const infoRoutes: Routes = [
  {
    path: 'infos', component: MenuComponent, children: [
      {path: 'login', component: LoginComponent, outlet: 'infobar'},
      {path: 'groupInfo', component: GroupInfoComponent, outlet: 'infobar', canActivate: [AuthGuard]},
      {path: 'deviceInfo', component: DeviceInfoComponent, outlet: 'infobar', canActivate: [AuthGuard]},
      {path: 'logs', component: LogsComponent, outlet: 'infobar', canActivate: [AuthGuard]}]
  },
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(infoRoutes)],
  exports: [RouterModule],
})
export class InfoRoutingModule {
}
