import {Component, OnInit} from '@angular/core';
import {DeviceInfo, ServerMessage} from '../info';
import {AwsService} from '../aws.service';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit {

  model: DeviceInfo;
  serverErrors: ServerMessage;

  constructor(private aws: AwsService) {
    this.model = {status: -1, data: {configuration: null, nickname: '', device_mac: '', device_status: 0}};
    this.serverErrors = {error: false, message: ''};
  }

  ngOnInit() {
    this.aws.getDeviceInfo().subscribe((value) => {
      const parsed = JSON.parse(value);
      if (parsed && parsed.data) {
        if (!parsed.data.configuration) {
          parsed.data.configuration = null;
          this.model = parsed;
        } else {
          this.model = parsed;
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  submit() {
    this.serverErrors.error = false;
    this.serverErrors.message = '';
    this.aws.postDeviceInfo(this.model).subscribe((value) => {
      this.serverErrors.message = 'Info aggiornate con successo, ricaricare il browser';
    }, (error) => {
      this.serverErrors.error = true;
      this.serverErrors = error.error.errorMessage;
    });
  }
}
