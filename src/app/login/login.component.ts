// login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.loginRequest).subscribe(
      (response) => {
        this.authService.setToken(response.token); // Store token in localStorage or sessionStorage
        alert('Login successful!');
        console.log(response.token)
        this.router.navigate(['/dashboard']); // Navigate to dashboard after login
      },
      (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }
}
