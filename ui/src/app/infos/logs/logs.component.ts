import {Component, OnInit} from '@angular/core';
import {Log} from '../info';
import {AwsService} from '../aws.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  log: Observable<Log>;
  errorCodes: number[];

  constructor(private aws: AwsService) {
  }

  ngOnInit() {
    this.log = this.aws.getLogs();
  }

  isError(eventId: number) {
    this.errorCodes.findIndex((e) => e === eventId);
  }

}
