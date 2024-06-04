import { Component, output } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.SignUpForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  showUserNameValidator = false;
  showPasswordValidator = false;

  showLoginForm = true;
  showSignUpForm = false;

  onClickValidateUser() {
    const { username, password } = this.loginForm.value;
    if (username != '' && password != '') {
      const url = `${'https://localhost:44359/api/HRPortal/validateUser'}?userName=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;
      this.http.get(url).subscribe(
        (data: any) => {
          const user = data.userID;
          if (data.isActive == true) {
            this.router.navigate(['/dashboard'], {
              queryParams: { userID: user },
            });
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            alert('User not found or invalid credentials.');
          } else {
            alert('An unexpected error occurred. Please try again later.');
          }
        }
      );
    } else {
      if (username.trim() == '') {
        this.showUserNameValidator = true;
      }
      if (password.trim() == '') {
        this.showPasswordValidator = true;
      }
    }
  }

  onClickSignUp() {
    this.showLoginForm = false;
    this.showSignUpForm = true;
  }

  onClickCancelSignUp() {
    this.showLoginForm = true;
    this.showSignUpForm = false;
  }

  SignUpForm: FormGroup;

  SignUpUserDetails: {
    userName: string;
    password: string;
  } = {
    userName: '',
    password: '',
  };

  onClickSubmit() {
    this.SignUpUserDetails = this.SignUpForm.value;
    const headers = { 'Content-Type': 'application/json' };

    const url = `${'https://localhost:44359/api/HRPortal/CreateUser'}`;

    this.http
      .post(url, this.SignUpUserDetails, { headers })
      .subscribe((data: any) => {
        this.showLoginForm = true;
        this.showSignUpForm = false;
      });
  }
}
