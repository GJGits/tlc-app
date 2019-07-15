import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  showIpSet: string;
  toggleConnection: boolean;
  avaibleWiFi: any[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
  }

  setIpAddress() {
    this.apiService.setIPAddress().subscribe((value) => this.showIpSet = value, (error) => console.log(error));
  }

  toggleConn() {
    this.toggleConnection = !this.toggleConnection;
    this.apiService.getAvaibleNetwork().subscribe((value) => this.avaibleWiFi = value, (error) => console.log(error));
  }

}
