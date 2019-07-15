import {Component, OnInit} from '@angular/core';
import {Link} from './link';

@Component({
  selector: 'app-router-bar',
  templateUrl: './router-bar.component.html',
  styleUrls: ['./router-bar.component.css']
})
export class RouterBarComponent implements OnInit {

  links: Link[] = [
    {link: 'consoleStatus', linkDisplay: 'Console'},
    {link: 'apartment', linkDisplay: 'Apartment'},
    {link: 'statistics', linkDisplay: 'Statistics'},
    {link: 'infos', linkDisplay: 'Infos'},
    {link: 'program', linkDisplay: 'Program'},
    // {link: 'network', linkDisplay: 'Network'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
