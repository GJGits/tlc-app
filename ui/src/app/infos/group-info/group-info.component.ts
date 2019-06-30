import {Component, OnInit} from '@angular/core';
import {GroupInfo, ServerMessage} from '../info';
import {AwsService} from '../aws.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {

  model: GroupInfo;
  serverErrors: ServerMessage;

  constructor(private awsService: AwsService) {
    this.model = {group_info: '', group_id: environment.groupId, group_psw: ''};
    this.serverErrors = {error: false, message: ''};
  }

  ngOnInit() {
    this.awsService.getGroupInfo(this.model.group_id).subscribe((value => {
      console.log(typeof value);
      this.model = JSON.parse(value);
    }));
  }

  submit() {
    this.serverErrors.error = false;
    this.serverErrors.message = '';
    this.awsService.postGroupInfo(this.model).subscribe((value) => {
      this.serverErrors.error = false;
      this.serverErrors.message = 'Group info aggiornate con successo';
    }, (error) => {
      this.serverErrors.error = true;
      this.serverErrors.message = error.errorMessage;
    });
  }
}
