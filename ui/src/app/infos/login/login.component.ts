import {Component, OnInit} from '@angular/core';
import {RegisterModel, RequestStatus} from '../menu/register-model';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: RegisterModel;
  serverErrors: RequestStatus = {error: false, message: ''};

  constructor(private auth: AuthService) {
    this.model = {username: '', password: ''};
  }

  ngOnInit() {
  }

  submit(event) {
    if (event.isTrusted) {
      let formValid = true;
      for (let count = 0; count < 2; count++) {
        if (!event.target[count].validity.valid) {
          formValid = false;
        }
      }
      if (formValid) {
        this.auth.login(this.model).subscribe((value) => {
          this.serverErrors = {error: false, message: 'Login OK, check your infos'};
          console.log(value);
        }, (err) => {
          this.serverErrors = {error: true, message: 'invalid credentials'};
          console.error(err);
        });
      }
    }
  }
}
