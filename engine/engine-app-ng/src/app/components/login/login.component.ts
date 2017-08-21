import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isError: Boolean;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.isError = false;
  }

  ngOnInit() {
  }

  onSubmit(form: any): void {
    if (this.loginForm.controls['username'].hasError('required')) {
      this.isError = true;
    }
    if (this.loginForm.controls['password'].hasError('required')) {
      this.isError = true;
    }
    this.isError = false;
    this.loginService.login(form).then(result => console.log(JSON.stringify(result)));
  }
}
