import {Component, OnInit} from '@angular/core';
import {Link} from '../../router-bar/link';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  links: Link[] = [
    {link: 'login', linkDisplay: 'Login'},
    {link: 'groupInfo', linkDisplay: 'Group Info'},
    {link: 'deviceInfo', linkDisplay: 'Device Info'},
    {link: 'logs', linkDisplay: 'Logs'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
